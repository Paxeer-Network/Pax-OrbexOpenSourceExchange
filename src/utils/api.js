"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$serverFetch = exports.fileToBase64 = void 0;
const sonner_1 = require("sonner");
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob)) {
            reject("The provided value is not a Blob or File.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}
exports.fileToBase64 = fileToBase64;
async function $fetch({ url, method = "GET", body = null, headers = {}, params = {}, successMessage = "Success", errorMessage = "Something went wrong", silent = false, }) {
    const toastId = !silent ? sonner_1.toast.loading("Loading...") : null;
    const defaultHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };
    const fetchOptions = {
        method,
        headers: defaultHeaders,
        credentials: "include",
    };
    let urlWithQuery = url;
    if (typeof window === "undefined")
        return { data: null, error: "Server-side fetch is not supported" };
    // Decompose the URL to handle existing query params only on the client-side
    const urlObj = new URL(url, window.location.origin);
    const existingParams = new URLSearchParams(urlObj.search);
    // Merge new params into existing params, converting all values to strings
    Object.entries(params).forEach(([key, value]) => {
        // Only set the parameter if it's different from the existing value
        if (existingParams.get(key) !== String(value)) {
            existingParams.set(key, String(value));
        }
    });
    // Construct final URL with all merged params
    urlWithQuery = `${urlObj.origin}${urlObj.pathname}${existingParams.toString() ? "?" + existingParams.toString() : ""}`;
    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(urlWithQuery, fetchOptions);
        if (!silent && toastId !== null)
            sonner_1.toast.dismiss(toastId);
        if (response.ok) {
            const data = await response.json();
            handleSuccess(data, successMessage, silent);
            return { data, error: null };
        }
        else {
            return await handleError(response, silent, errorMessage);
        }
    }
    catch (error) {
        return handleNetworkError(error, silent, toastId);
    }
}
function handleSuccess(data, successMessage, silent) {
    let messageToShow = "Success";
    if (typeof successMessage === "function") {
        messageToShow = successMessage(data);
    }
    else if (successMessage !== "Success") {
        messageToShow = successMessage;
    }
    else if (data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string") {
        messageToShow = data.message;
    }
    if (!silent)
        sonner_1.toast.success(messageToShow);
}
async function handleError(response, silent, errorMessage) {
    let errorData;
    try {
        errorData = await response.json();
        if (response.status === 400 &&
            errorData.message.startsWith("Invalid request body:")) {
            // Clean the message and parse it into an object
            const cleanMessage = errorData.message
                .replace("Invalid request body:", "")
                .trim();
            const errorObjectRaw = JSON.parse(cleanMessage);
            // Convert the dot-notated keys in errorObjectRaw to a nested object
            const validationErrors = parseDotNotatedJsonToNestedObject(errorObjectRaw);
            return {
                data: null,
                error: "Validation error",
                validationErrors,
            };
        }
        if (errorData.message.includes("Validation error:")) {
            // Parse the error message to extract field-specific messages
            const formattedErrors = parseValidationError(errorData.message);
            return {
                data: null,
                error: "Validation error",
                validationErrors: formattedErrors,
            };
        }
    }
    catch (e) {
        errorData = { message: response.statusText };
    }
    const message = errorData.message || errorMessage;
    if (!silent)
        sonner_1.toast.error(message);
    return { data: null, error: message };
}
function parseDotNotatedJsonToNestedObject(errorObjectRaw) {
    const nestedErrors = {};
    Object.entries(errorObjectRaw).forEach(([key, value]) => {
        const path = key.split(".");
        path.reduce((acc, part, index) => {
            if (index === path.length - 1) {
                acc[part] = Array.isArray(value) ? value[0] : value; // Take the first error message if it's an array
            }
            else {
                acc[part] = acc[part] || {};
            }
            return acc[part];
        }, nestedErrors);
    });
    return nestedErrors;
}
function parseValidationError(errorMessage) {
    const errorLines = errorMessage.split("\n");
    const errors = {};
    errorLines.forEach((line) => {
        // Remove the 'Validation error: ' prefix and split by the first ':'
        const cleanLine = line.replace("Validation error: ", "");
        const firstColonIndex = cleanLine.indexOf(":");
        const key = cleanLine.substring(0, firstColonIndex).trim();
        const message = cleanLine.substring(firstColonIndex + 1).trim();
        errors[key] = message;
    });
    return errors;
}
function handleNetworkError(error, silent, toastId) {
    console.error("Fetch error:", error);
    if (!silent) {
        if (toastId !== null) {
            sonner_1.toast.dismiss(toastId);
        }
        const message = error instanceof Error ? error.message : "Unknown error";
        sonner_1.toast.error(`Network error: ${message}. Please try again later.`);
    }
    return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
    };
}
async function $serverFetch(context, { url, method = "GET", body = null, headers = {} }) {
    const protocol = context.req.headers["x-forwarded-proto"] || "http";
    const baseUrl = `${protocol}://${context.req.headers.host}`;
    const fullUrl = `${baseUrl}${url}`;
    const defaultHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };
    const fetchOptions = {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : null,
    };
    try {
        const response = await fetch(fullUrl, fetchOptions);
        // Check if response is not JSON, handle unexpected responses like "Not Found"
        if (!response.ok) {
            const textResponse = await response.json();
            return { data: null, error: textResponse.message || response.statusText };
        }
        // Parse response as JSON
        try {
            const data = await response.json();
            return { data, error: null };
        }
        catch (jsonError) {
            // If JSON parsing fails, return the raw response text as the error
            const rawText = await response.text();
            return { data: null, error: `Invalid JSON response: ${rawText}` };
        }
    }
    catch (error) {
        console.error("Server-side Fetch error:", error);
        return { data: null, error: "Server Error" };
    }
}
exports.$serverFetch = $serverFetch;
exports.default = $fetch;
