import "./instrumentation"; // instrumenting the application
import type { Express } from "express";
import type { Server } from "http";
import { initializeWorker } from "./initialize";
import { env } from "./env";
import { logger } from "@langfuse/shared/src/server";

export let server: Server | undefined;

const startWorker = async (): Promise<void> => {
  await initializeWorker();

  const app = require("./app").default as Express;

  server = app.listen(env.PORT, env.HOSTNAME, () => {
    logger.info(`Listening: http://${env.HOSTNAME}:${env.PORT}`);
  });
};

startWorker().catch((error) => {
  logger.error("Failed to start worker", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
