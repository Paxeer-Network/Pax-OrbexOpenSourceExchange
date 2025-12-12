"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-require-imports */
// index.ts
require("dotenv").config();
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const backend_1 = require("./backend");
const port = Number(process.env.NEXT_PUBLIC_BACKEND_PORT) || 4000;
const threads = Number(process.env.NEXT_PUBLIC_BACKEND_THREADS) || 2;
if (worker_threads_1.isMainThread) {
    const acceptorApp = new backend_1.MashServer();
    acceptorApp.listen(port, () => {
        console.log(`Main Thread: listening on port ${port} (thread ${worker_threads_1.threadId})`);
    });
    // Spawn worker threads with incremental ports
    const cpuCount = require("os").cpus().length;
    if (threads > cpuCount) {
        console.warn(`WARNING: Number of threads (${threads}) is greater than the number of CPUs (${cpuCount})`);
    }
    const usableThreads = Math.min(threads, cpuCount);
    for (let i = 0; i < usableThreads; i++) {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, "backend", "worker.ts"), {
            execArgv: ["-r", "ts-node/register", "-r", "module-alias/register"], // Add module-alias/register here
            workerData: { port: 4001 + i }, // Unique port for each worker
        });
        // Listen for messages and errors from the worker
        worker.on("message", (workerAppDescriptor) => {
            acceptorApp.addChildAppDescriptor(workerAppDescriptor);
        });
        worker.on("error", (err) => {
            console.error(`Error in worker ${i}:`, err);
        });
        worker.on("exit", (code) => {
            if (code !== 0) {
                console.error(`Worker ${i} stopped with exit code ${code}`);
            }
        });
    }
}
