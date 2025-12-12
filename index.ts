// File: index.ts

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
require("dotenv").config();
import "./module-alias-setup";
import { MashServer } from "@b/index";
import logger from "@b/utils/logger";

const port = process.env.NEXT_PUBLIC_BACKEND_PORT || 4000;

const startApp = async () => {
  try {
    const app = new MashServer();
    app.listen(Number(port), () => {
      console.log(
        `\x1b[36mMain Thread: Server running on port ${port}...\x1b[0m`
      );
    });
  } catch (error) {
    logger(
      "error",
      "app",
      __filename,
      `Failed to initialize app: ${error.message}`
    );
    process.exit(1);
  }
};

startApp();
