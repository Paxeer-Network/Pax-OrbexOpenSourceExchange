"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightDescription = exports.capitalize = void 0;
const capitalize = (text) => text[0].toUpperCase() + text.substr(1, text.length);
exports.capitalize = capitalize;
const weightDescription = (weight) => weight === 400 ? "Regular" : weight === 500 ? "Medium" : "Bold";
exports.weightDescription = weightDescription;
