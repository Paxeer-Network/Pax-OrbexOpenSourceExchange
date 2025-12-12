import fs from "fs/promises";
import path from "path";
import { Request, Response } from "..";
import {
  authenticate,
  handleApiVerification,
  rateLimit,
  rolesGate,
  siteMaintenanceAccessGate,
} from "../handler/Middleware";
import { handleWsMethod } from "./Websocket";
import { sanitizePath } from "@b/utils/validation";
import { isProduction } from "@b/utils/constants";
import { logError } from "@b/utils/logger";

const fileExtension = isProduction ? ".js" : ".ts";
export const routeCache = new Map();

export async function setupApiRoutes(app, startPath, basePath = "/api") {
  const entries = await fs.readdir(startPath, { withFileTypes: true });

  const sortedEntries = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return 1;
    if (!a.isDirectory() && b.isDirectory()) return -1;
    if (a.isDirectory() && b.isDirectory()) {
      const aHasBrackets = a.name.includes("[");
      const bHasBrackets = b.name.includes("[");
      if (aHasBrackets && !bHasBrackets) return 1;
      if (!aHasBrackets && bHasBrackets) return -1;
    }
    return 0;
  });

  for (const entry of sortedEntries) {
    const entryPath = sanitizePath(path.join(startPath, entry.name));

    if (
      (entry.isDirectory() && entry.name === "util") ||
      entry.name === `queries${fileExtension}` ||
      entry.name === `utils${fileExtension}`
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      await setupApiRoutes(
        app,
        entryPath,
        `${basePath}/${entry.name.replace(/\[(\w+)\]/, ":$1")}`
      );
      continue;
    }

    const [fileName, method] = entry.name.split(".");
    let routePath = basePath + (fileName !== "index" ? `/${fileName}` : "");
    routePath = routePath
      .replace(/\[(\w+)\]/g, ":$1")
      .replace(/\.get|\.post|\.put|\.delete|\.del|\.ws/, "");

    if (typeof app[method] === "function") {
      if (method === "ws") {
        handleWsMethod(app, routePath, entryPath);
      } else {
        handleHttpMethod(app, method, routePath, entryPath);
      }
    }
  }
}

async function handleHttpMethod(app, method, routePath, entryPath) {
  app[method](routePath, async (res, req) => {
    const startTime = Date.now();

    let metadata, handler;
    const cached = routeCache.get(entryPath);
    if (cached) {
      handler = cached.handler;
      metadata = cached.metadata;
      req.setMetadata(metadata);
    } else {
      try {
        const handlerModule = await import(entryPath);
        handler = handlerModule.default;
        if (!handler) {
          throw new Error(`Handler not found for ${entryPath}`);
        }

        metadata = handlerModule.metadata;
        if (!metadata) {
          throw new Error(`Metadata not found for ${entryPath}`);
        }
        req.setMetadata(metadata);
        routeCache.set(entryPath, { handler, metadata });
      } catch (error) {
        logError("route", error, entryPath);
        res.handleError(500, error.message);
        return;
      }
    }

    if (typeof handler !== "function") {
      throw new Error(`Handler is not a function for ${entryPath}`);
    }

    try {
      await req.parseBody();
    } catch (error) {
      logError("route", error, entryPath);
      res.handleError(400, `Invalid request body: ${error.message}`);
      return;
    }

    const endBenchmarking = () => {
      const duration = Date.now() - startTime;
      let color = "\x1b[0m";
      let label = "FAST";

      if (duration > 1000) {
        color = "\x1b[41m";
        label = "VERY SLOW";
      } else if (duration > 500) {
        color = "\x1b[31m";
        label = "SLOW";
      } else if (duration > 200) {
        color = "\x1b[33m";
        label = "MODERATE";
      } else if (duration > 100) {
        color = "\x1b[32m";
        label = "GOOD";
      } else if (duration > 50) {
        color = "\x1b[36m";
        label = "FAST";
      } else if (duration > 10) {
        color = "\x1b[34m";
        label = "VERY FAST";
      } else {
        color = "\x1b[35m";
        label = "EXCELLENT";
      }

      console.log(
        `${color}[${label}] Request to ${routePath} (${method.toUpperCase()}) - Duration: ${duration}ms\x1b[0m`
      );
    };

    if (metadata.requiresApi) {
      await handleApiVerification(res, req, async () => {
        await handleRequest(res, req, handler, entryPath);
        endBenchmarking();
      });
      return;
    }

    if (!metadata.requiresAuth) {
      await handleRequest(res, req, handler, entryPath);
      endBenchmarking();
      return;
    }

    await rateLimit(res, req, async () => {
      await authenticate(res, req, async () => {
        await rolesGate(app, res, req, routePath, method, async () => {
          await siteMaintenanceAccessGate(app, res, req, async () => {
            await handleRequest(res, req, handler, entryPath);
            endBenchmarking();
          });
        });
      });
    });
  });
}

async function handleRequest(
  res: Response,
  req: Request,
  handler,
  entryPath: string
) {
  try {
    const result = await handler(req);
    res.sendResponse(req, 200, result);
  } catch (error) {
    logError("route", error, entryPath);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.handleError(statusCode, message);
  }
}
