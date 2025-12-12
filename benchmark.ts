import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { sanitizePath } from "@b/utils/validation";

dotenv.config();

const API_BASE_URL = `http://localhost:${process.env.BACKEND_PORT || 4000}`;
const superAdminCredentials = {
  email: "superadmin@example.com",
  password: "12345678",
};
let authCookies = "";
let csrfToken = "";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to log in and store authentication cookies
async function loginAsSuperAdmin() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(superAdminCredentials),
      credentials: "include",
    });

    const rawCookies = response.headers.get("set-cookie");
    if (rawCookies) {
      authCookies = rawCookies
        .split(",")
        .map((cookie) => cookie.split(";")[0])
        .join("; ");
      console.log("Logged in as Super Admin.");
      console.log("Auth Cookies:", authCookies);

      // Extract csrfToken from cookies if present
      const csrfMatch = rawCookies.match(/csrfToken=([^;]+)/);
      if (csrfMatch) {
        csrfToken = csrfMatch[1];
        console.log("CSRF Token:", csrfToken);
      }
    } else {
      console.error("No cookies returned from login response.");
    }
  } catch (error) {
    console.error("Error during login:", error.message);
  }
}

// Function to benchmark an individual route
async function benchmarkRoute(routePath: string) {
  try {
    // First call - skip logging
    await fetch(`${API_BASE_URL}${routePath}`, {
      method: "GET",
      headers: {
        Cookie: authCookies,
        "x-csrf-token": csrfToken,
      },
      credentials: "include",
    });
    await delay(100); // Optional delay between requests

    // Second call - log timing and result
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}${routePath}`, {
      method: "GET",
      headers: {
        Cookie: authCookies,
        "x-csrf-token": csrfToken,
      },
      credentials: "include",
    });
    const duration = Date.now() - startTime;

    // Determine label and color based on duration
    let label = "FAST";
    let color = "\x1b[32m"; // Green

    if (duration > 1000) {
      label = "VERY SLOW";
      color = "\x1b[41m"; // Red background
    } else if (duration > 500) {
      label = "SLOW";
      color = "\x1b[31m"; // Red
    } else if (duration > 200) {
      label = "MODERATE";
      color = "\x1b[33m"; // Yellow
    } else if (duration > 100) {
      label = "GOOD";
      color = "\x1b[36m"; // Cyan
    } else if (duration > 50) {
      label = "VERY FAST";
      color = "\x1b[34m"; // Blue
    }

    console.log(
      `${color}[${label}] GET ${routePath} took ${duration}ms\x1b[0m`
    );

    if (!response.ok && response.status === 404) {
      console.warn(`Warning: ${routePath} returned 404 - Not Found`);
    }
  } catch (error) {
    console.error(`Failed to benchmark ${routePath}:`, error.message);
  }
}

// Function to find all GET routes in the API folder
async function findGetRoutes(startPath: string, basePath = "/api") {
  const routes: string[] = [];
  const entries = await fs.readdir(startPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = sanitizePath(path.join(startPath, entry.name));

    if (entry.isDirectory()) {
      const subRoutes = await findGetRoutes(
        entryPath,
        `${basePath}/${entry.name.replace(/\[(\w+)\]/, ":$1")}`
      );
      routes.push(...subRoutes);
    } else if (
      entry.name.endsWith(".get.ts") ||
      entry.name.endsWith(".get.js")
    ) {
      let routePath = `${basePath}/${entry.name.replace(/\.get\.\w+$/, "")}`;

      // Replace dynamic segments like :id with a sample value, e.g., 1
      routePath = routePath
        .replace(/:type/g, "defaultType")
        .replace(/:currency/g, "USD")
        .replace(/:id/g, "1");

      // Remove '/index' from the route if it exists
      if (routePath.endsWith("/index")) {
        routePath = routePath.slice(0, -6); // Remove `/index`
      }

      routes.push(routePath);
    }
  }

  return routes;
}

// Main function to run the benchmark
async function runBenchmark() {
  await loginAsSuperAdmin(); // Log in before benchmarking
  if (!authCookies) {
    console.error("Authentication failed. Exiting benchmark.");
    return;
  }

  const apiPath = path.join(__dirname, "backend/api"); // Adjust to your API folder path
  const routes = await findGetRoutes(apiPath);

  for (const route of routes) {
    await benchmarkRoute(route);
  }

  process.exit(0); // Exit after benchmarking completes
}

runBenchmark();
