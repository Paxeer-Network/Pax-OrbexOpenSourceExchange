import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";
import { gate } from "./utils/gate";

const AUTH_PAGES = ["/login", "/register", "/forgot", "/reset"];

const tokenSecret = process.env.APP_ACCESS_TOKEN_SECRET;
const dev = process.env.NODE_ENV !== "production";
const frontendPort = process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000;
const siteUrl = dev
  ? `http://localhost:${frontendPort}`
  : process.env.NEXT_PUBLIC_SITE_URL;
const isFrontendEnabled = process.env.NEXT_PUBLIC_FRONTEND === "true";
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";
const isMaintenance =
  process.env.NEXT_PUBLIC_MAINTENANCE_STATUS === "true" || false;

if (!tokenSecret) {
  throw new Error("APP_ACCESS_TOKEN_SECRET is not set");
}

if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}

interface Role {
  name: string;
  permissions: string[];
}

interface RolesCache {
  [key: string]: Role;
}

let rolesCache: RolesCache | null = null;

async function fetchRolesAndPermissions(request: NextRequest) {
  try {
    // Use localhost for server-side API calls
    const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || 4000;
    const apiUrl = `http://localhost:${backendPort}/api/auth/role`;

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(apiUrl, { headers });

    if (response.ok) {
      const data = await response.json();
      rolesCache = data.reduce((acc: RolesCache, role: any) => {
        acc[role.id] = {
          name: role.name,
          permissions: role.permissions.map(
            (permission: any) => permission.name
          ),
        };
        return acc;
      }, {});
    } else {
      console.error(
        `Failed to fetch roles and permissions: ${response.status} ${response.statusText}`
      );
      if (response.status === 500) {
        rolesCache = null; // Reset rolesCache to retry on the next call
      }
    }
  } catch (error) {
    console.error("Error fetching roles and permissions:", error);
    rolesCache = null; // Reset rolesCache to retry on the next call
  }
}

async function hasPermission(
  payload: {
    sub: {
      role: number;
    };
  },
  path: string
): Promise<boolean> {
  if (rolesCache && payload.sub && typeof payload.sub.role === "number") {
    const roleId = payload.sub.role;
    const role = rolesCache[roleId];
    if (role) {
      if (role.name === "Super Admin") {
        return true;
      }
      let requiredPermission = gate[path];
      if (!requiredPermission && path.startsWith("/admin")) {
        requiredPermission = "Access Admin Dashboard";
      }
      if (
        requiredPermission &&
        role.permissions.length > 0 &&
        role.permissions.includes(requiredPermission)
      ) {
        return true;
      }
    }
  }
  return false;
}

async function verifyToken(
  accessToken: string
): Promise<JWTVerifyResult | null> {
  try {
    const result = await jwtVerify(
      accessToken,
      new TextEncoder().encode(tokenSecret),
      {
        clockTolerance: 300, // Allow for 5 minutes of clock skew
      }
    );
    return result;
  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
      console.warn("Token expired:", error.message);
    } else {
      console.error("Error verifying token:", error.message);
    }
    return null;
  }
}

async function refreshToken(request: NextRequest) {
  try {
    // Use localhost for server-side API calls
    const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || 4000;
    const response = await fetch(`http://localhost:${backendPort}/api/auth/session`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (response.ok) {
      const cookies =
        response.headers.get("set-cookie") || response.headers.get("cookie");
      if (cookies) {
        const accessToken = cookies.match(/accessToken=([^;]+);/)?.[1] || null;
        return accessToken;
      } else {
        console.error("No 'set-cookie' header in response.");
      }
    } else {
      console.error(
        "Failed to refresh token:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fetch roles and permissions if not done yet
  if (!rolesCache || Object.keys(rolesCache).length === 0) {
    await fetchRolesAndPermissions(request);
  }

  if (!isFrontendEnabled && (pathname === "/" || pathname === "")) {
    const isLoggedIn = request.cookies.has("accessToken");
    const url = new URL(request.nextUrl);

    if (isLoggedIn) {
      url.pathname = defaultUserPath;
    } else {
      url.pathname = "/login";
    }
    return NextResponse.redirect(url.toString());
  }

  let accessToken = request.cookies.get("accessToken")?.value;
  let payload: any = null;
  let isTokenValid = false;

  if (accessToken) {
    const verifiedToken = await verifyToken(accessToken);
    if (verifiedToken) {
      payload = verifiedToken.payload;
      isTokenValid = true;
    }
  }

  if (!isTokenValid) {
    const sessionId = request.cookies.get("sessionId")?.value;
    if (sessionId) {
      accessToken = (await refreshToken(request)) as string;
      if (accessToken) {
        const verifiedToken = await verifyToken(accessToken);
        if (verifiedToken) {
          payload = verifiedToken.payload;
          isTokenValid = true;

          // Set the new token in cookies
          const response = NextResponse.next();
          response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: !dev,
            sameSite: "lax",
            path: "/",
          });
          return response;
        }
      }
    }
  }

  if (isMaintenance && pathname !== "/login") {
    if (!isTokenValid) {
      const url = new URL(request.nextUrl);
      url.pathname = "/maintenance";
      return NextResponse.redirect(url.toString());
    } else {
      if (!payload || !payload.sub || !payload.sub.role) {
        const url = new URL(request.nextUrl);
        url.pathname = "/maintenance";
        return NextResponse.redirect(url.toString());
      }
      const roleId = payload.sub.role;
      const userRole = rolesCache?.[roleId];
      if (
        !userRole ||
        (userRole.name !== "Super Admin" &&
          !userRole.permissions.includes("Access Admin Dashboard"))
      ) {
        const url = new URL(request.nextUrl);
        url.pathname = "/maintenance";
        return NextResponse.redirect(url.toString());
      }
    }
  }

  // If the user is authenticated and tries to access auth pages, redirect to default path
  if (isTokenValid && AUTH_PAGES.includes(pathname)) {
    const returnUrl =
      request.nextUrl.searchParams.get("return") || defaultUserPath;
    const url = new URL(request.nextUrl);
    url.pathname = returnUrl;
    url.searchParams.delete("return");
    return NextResponse.redirect(url.toString());
  }

  // Redirect unauthenticated users trying to access restricted pages
  if (
    !isTokenValid &&
    (pathname.startsWith("/user") || pathname.startsWith("/admin"))
  ) {
    const url = new URL(request.nextUrl);
    url.pathname = "/login";
    url.searchParams.set("return", pathname);
    return NextResponse.redirect(url.toString());
  }

  if (
    isTokenValid &&
    (pathname.startsWith("/admin") || pathname in gate) &&
    !(await hasPermission(payload!, pathname))
  ) {
    const url = new URL(request.nextUrl);
    url.pathname = defaultUserPath;
    url.searchParams.delete("return");
    return NextResponse.redirect(url.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register",
    "/forgot",
    "/reset",
    "/uploads/:path*",
  ],
};
