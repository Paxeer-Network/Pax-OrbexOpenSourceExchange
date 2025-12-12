import heicConvert from "heic-convert";
import fs from "fs/promises";
import path from "path";
import { sanitizePath } from "@b/utils/validation";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata = {
  summary: "Converts a HEIC image to JPEG format",
  description: "Converts a HEIC image to JPEG format and returns the file URL",
  operationId: "convertHeicFile",
  tags: ["Conversion"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            dir: {
              type: "string",
              description: "Directory to save the converted file",
            },
            file: {
              type: "string",
              description: "Base64 encoded HEIC file data",
            },
            mimeType: { type: "string", description: "MIME type of the file" }, // Added mimeType
          },
          required: ["dir", "file", "mimeType"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "File converted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              url: { type: "string", description: "URL of the converted file" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Conversion"),
    500: serverErrorResponse,
  },
};

const BASE_CONVERT_DIR = path.join(process.cwd(), "public", "converted");

export default async (data) => {
  const { body, user } = data;
  if (!user) throw new Error("User not found");

  const { dir, file: base64File, mimeType } = body;
  if (!dir || !base64File || !mimeType) {
    throw new Error("Missing required fields: dir, file, or mimeType");
  }

  // Decode the base64 string to get the binary data
  const base64Data = base64File.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");

  // Validate the directory path and create directories if necessary
  const sanitizedDir = sanitizePath(dir.replace(/-/g, "/"));
  const mediaDir = path.join(BASE_CONVERT_DIR, sanitizedDir);
  await ensureDirExists(mediaDir);

  // Define the output filename
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const outputPath = path.join(mediaDir, filename);

  // Check MIME type and ensure it's a supported HEIC format
  if (!mimeType.includes("heic") && !mimeType.includes("heif")) {
    throw new Error(
      "Unsupported file format. Only HEIC or HEIF files are allowed."
    );
  }

  // Convert HEIC to JPEG using `heic-convert`
  try {
    const jpegBuffer = await heicConvert({
      buffer, // Input buffer for HEIC data
      format: "JPEG", // Output format as JPEG
      quality: 0.8, // Quality scale: 0-1 (optional, defaults to 1)
    });

    // Write the converted JPEG file to the target directory
    await fs.writeFile(outputPath, jpegBuffer);

    // Return the file URL
    return { url: `/converted/${sanitizedDir}/${filename}` };
  } catch (error) {
    console.error("Error converting HEIC to JPEG using `heic-convert`:", error);
    throw new Error("HEIC to JPEG conversion failed using `heic-convert`.");
  }
};

// Helper function to ensure the directory exists
async function ensureDirExists(dir) {
  try {
    await fs.access(dir);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(dir, { recursive: true });
    } else {
      throw error;
    }
  }
}
