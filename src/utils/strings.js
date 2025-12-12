"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = exports.randomUniqueId = exports.toCamelCase = exports.RE_DIGIT = exports.slugify = void 0;
function slugify(str) {
    return str
        .replace(/^\s+|\s+$/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
exports.slugify = slugify;
exports.RE_DIGIT = /^\d+$/;
function toCamelCase(path) {
    return path
        .split("/") // Split the string by '/' to process directory and file separately
        .map((part) => {
        return part
            .toLowerCase() // Convert the entire string to lower case
            .split(" ") // Split the string by space to find individual words
            .map((word, index) => {
            // If it's the first word, return as is; otherwise capitalize the first letter
            if (index === 0)
                return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
            .join(""); // Join the words back together without spaces
    })
        .join("/"); // Join the directory and file parts back with '/'
}
exports.toCamelCase = toCamelCase;
const randomUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.randomUniqueId = randomUniqueId;
const formatNumber = (value) => {
    if (typeof value === "number" && value !== 0) {
        // Convert the number to a string to evaluate its length
        const strValue = value.toString();
        // If it's in scientific notation or very small, format with `toFixed`
        if (strValue.includes("e") || value < 0.001) {
            return value.toLocaleString("en", {
                minimumFractionDigits: 8,
                maximumFractionDigits: 20,
            });
        }
    }
    return value;
};
exports.formatNumber = formatNumber;
