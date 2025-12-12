// server.ts
import {
  App,
  type AppOptions,
  type RecognizedString,
  type WebSocketBehavior,
} from "uWebSockets.js";
import { RouteHandler } from "./handler/RouteHandler";
import { type IErrorHandler, type IRequestHandler } from "./types";
import {
  allowedOrigins,
  serveStaticFile,
  setCORSHeaders,
  setupProcessEventHandlers,
} from "./utils";
import { setupApiRoutes } from "@b/handler/Routes";
import { setupSwaggerRoute } from "@b/docs";
import { setupDefaultRoutes } from "@b/utils";
import { rolesManager } from "@b/utils/roles";
import CronJobManager, { createWorker } from "@b/utils/cron";
import "@b/db";
import { initialize } from "@b/utils/eco/scylla/client";
import { MatchingEngine } from "@b/utils/eco/matchingEngine";
import logger from "@b/utils/logger";
import { Response } from "./handler/Response";
import * as path from "path";
import { baseUrl } from "@b/utils/constants";
import { CacheManager } from "./utils/cache";
import { isMainThread, threadId } from "worker_threads";
import { sequelize } from "@b/db";

export class MashServer extends RouteHandler {
  private app;
  private roles: any;
  private benchmarkRoutes: { method: string; path: string }[] = [];

  constructor(options: AppOptions = {}) {
    super();
    this.app = App(options);
    this.cors();
    this.initializeServer();
    setupProcessEventHandlers();
  }

  public listen(port: number, cb: VoidFunction) {
    this.app.any("/*", (res, req) => {
      let responseSent = false;

      res.onAborted(() => {
        responseSent = true;
      });

      try {
        const url = req.getUrl();
        if (["/uploads/", "/themes/"].some((path) => url.startsWith(path))) {
          const handled = serveStaticFile(
            res,
            req,
            url,
            () => (responseSent = true)
          );
          if (handled) return;
        }
        this.processRoute(res, req, () => (responseSent = true));
      } catch (error) {
        console.error("Server error :", error);
        if (!responseSent && !res.aborted) {
          const response = new Response(res);
          response.handleError(500, `Internal Server Error: ${error.message}`);
          responseSent = true;
        }
      }
    });

    this.app.listen(port, cb);
  }

  public async initializeServer() {
    try {
      const threadType = isMainThread ? "Main Thread" : `Worker ${threadId}`;
      console.log(`\x1b[36m${threadType}: Initializing server...\x1b[0m`);

      // Ensure models are initialized
      await this.ensureDatabaseReady();

      console.log(`\x1b[36m${threadType}: Setting up roles...\x1b[0m`);
      await this.safeExecute(() => this.setupRoles(), "setupRoles");

      console.log(`\x1b[36m${threadType}: Setting up routes...\x1b[0m`);
      await this.safeExecute(() => this.setupRoutes(), "setupRoutes");

      console.log(`\x1b[36m${threadType}: Setting up cron jobs...\x1b[0m`);
      await this.safeExecute(() => this.setupCronJobs(), "setupCronJobs");

      console.log(
        `\x1b[36m${threadType}: Loading extensions and checking ecosystem...\x1b[0m`
      );

      await this.safeExecute(async () => {
        const cacheManager = CacheManager.getInstance();
        const extensions = await cacheManager.getExtensions();
        if (extensions.has("ecosystem")) {
          await this.setupEcosystem();
        }
      }, "setupEcosystem");

      console.log(
        `\x1b[32m${threadType}: Server initialized successfully\x1b[0m`
      ); // Green for success log
    } catch (error) {
      console.error(
        `\x1b[31mError during application initialization: ${error.message}\x1b[0m`
      ); // Red for error log
      process.exit(1);
    }
  }

  private async ensureDatabaseReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (sequelize) {
        resolve();
      } else {
        reject(new Error("Sequelize instance is not initialized."));
      }
    });
  }

  // Helper method to execute async functions safely and log any errors
  private async safeExecute(fn: () => Promise<void>, label: string) {
    try {
      await fn();
    } catch (error) {
      logger("error", label, __filename, `${label} failed: ${error.message}`);
      throw error; // Rethrow to be handled by initializeServer's catch
    }
  }

  private async setupRoles() {
    await rolesManager.initialize();
    this.setRoles(rolesManager.roles);
  }

  private async setupRoutes() {
    setupApiRoutes(this, path.join(baseUrl, "api"));
    setupSwaggerRoute(this);
    setupDefaultRoutes(this);
  }

  private async setupCronJobs(): Promise<void> {
    if (!isMainThread) return; // Only the main thread should setup cron jobs
    const cronJobManager = await CronJobManager.getInstance(); // Ensure all cron jobs are loaded
    const cronJobs = cronJobManager.getCronJobs();
    const threadType = isMainThread ? "Main Thread" : `Worker ${threadId}`;

    // Create workers for each job
    cronJobs.forEach((job) => {
      createWorker(job.name, job.function, job.period);
      console.log(`\x1b[33m${threadType} Cron created: ${job.name}\x1b[0m`);
    });
  }

  private async setupEcosystem() {
    try {
      await initialize();
      await MatchingEngine.getInstance();
    } catch (error) {
      logger(
        "error",
        "ecosystem",
        __filename,
        `Error initializing ecosystem: ${error.message}`
      );
    }
  }

  public get(path: string, ...handler: IRequestHandler[]) {
    this.benchmarkRoutes.push({ method: "get", path });
    super.set("get", path, ...handler);
  }

  public post(path: string, ...handler: IRequestHandler[]) {
    super.set("post", path, ...handler);
  }

  public put(path: string, ...handler: IRequestHandler[]) {
    super.set("put", path, ...handler);
  }

  public patch(path: string, ...handler: IRequestHandler[]) {
    super.set("patch", path, ...handler);
  }

  public del(path: string, ...handler: IRequestHandler[]) {
    super.set("delete", path, ...handler);
  }

  public options(path: string, ...handler: IRequestHandler[]) {
    super.set("options", path, ...handler);
  }

  public head(path: string, ...handler: IRequestHandler[]) {
    super.set("head", path, ...handler);
  }

  public connect(path: string, ...handler: IRequestHandler[]) {
    super.set("connect", path, ...handler);
  }

  public trace(path: string, ...handler: IRequestHandler[]) {
    super.set("trace", path, ...handler);
  }

  public all(path: string, ...handler: IRequestHandler[]) {
    super.set("all", path, ...handler);
  }

  public getBenchmarkRoutes() {
    return this.benchmarkRoutes;
  }

  public use(middleware: IRequestHandler) {
    super.use(middleware);
  }

  public error(cb: IErrorHandler) {
    super.error(cb);
  }

  public notFound(cb: IRequestHandler) {
    super.notFound(cb);
  }

  public ws<T>(pattern: RecognizedString, behavior: WebSocketBehavior<T>) {
    this.app.ws(pattern, behavior);
  }

  public cors() {
    this.app.options("/*", (res, req) => {
      const origin = req.headers ? req.headers["origin"] : undefined;
      if (origin && allowedOrigins.includes(origin)) {
        setCORSHeaders(res, origin);
      }
      res.end();
    });

    this.use((res, req, next) => {
      const origin = req.headers ? req.headers["origin"] : undefined;
      if (origin && allowedOrigins.includes(origin)) {
        setCORSHeaders(res, origin);
      }
      if (typeof next === "function") {
        next();
      }
    });
  }

  public setRoles(roles: Map<any, any>) {
    this.roles = roles;
  }

  public getRole(id: any) {
    return this.roles.get(id);
  }

  public getDescriptor() {
    // Return the descriptor of the uWS app instance
    return this.app.getDescriptor();
  }

  public addChildAppDescriptor(descriptor: any) {
    // Add a child app descriptor to the main app
    this.app.addChildAppDescriptor(descriptor);
  }
}
