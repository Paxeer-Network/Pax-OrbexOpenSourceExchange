/* eslint-disable @typescript-eslint/no-require-imports */
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";

// Check if the environment is production
const isProduction = process.env.NODE_ENV === "production";

export function initModels(sequelize: Sequelize) {
  const models: Record<string, any> = {};

  // Get the current file name to exclude it from model imports
  const currentFileName = path.basename(__filename);

  // Get the correct file extension based on the environment
  const fileExtension = isProduction ? ".js" : ".ts";

  // Read files in the current directory, excluding the index and current file
  const modelFiles = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== currentFileName &&
      file.endsWith(fileExtension) && // Only load files with the correct extension
      !file.includes("index") // Exclude index files if any
    );
  });

  // Load each model file
  try {
    for (const file of modelFiles) {
      const modelPath = path.join(__dirname, file);
      const modelModule = require(modelPath);
      const model = modelModule.default || modelModule; // Handle default exports

      // Check if the module has an initModel method
      if (model && typeof model.initModel === "function") {
        const initializedModel = model.initModel(sequelize);

        // Use the class name as the model name
        const modelName = initializedModel.name;
        if (!modelName) {
          console.error(`Model from file ${file} has no modelName set.`);
          continue;
        }

        models[modelName] = initializedModel;
      } else {
        console.error(
          `Model from file ${file} does not have an initModel method or a valid export structure.`
        );
      }
    }

    // Setup associations for all models except wallet and user
    Object.keys(models).forEach((modelName) => {
      const model = models[modelName];
      if (typeof model.associate === "function") {
        model.associate(models);
      }
    });
  } catch (error) {
    console.error(`Error initializing models: ${error.message}`);
  }

  console.info(
    `\x1b[36mMain Thread: ${modelFiles.length} Models initialized successfully...\x1b[0m`
  );

  return models;
}

export type Models = ReturnType<typeof initModels>;
