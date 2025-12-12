"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tags = void 0;
const datatable_1 = require("@/utils/datatable");
const Tag_1 = __importDefault(require("../../../tag/Tag"));
const TagsBase = ({ item, value }) => {
    let tags = value;
    if (typeof value === "string") {
        tags = (0, datatable_1.safeJSONParse)(value);
    }
    // Ensure tags is always treated as an iterable array
    let tagEntries;
    if (Array.isArray(tags)) {
        tagEntries = tags.map((tag) => [null, tag]);
    }
    else if (typeof tags === "object" && tags !== null) {
        tagEntries = Object.entries(tags);
    }
    else {
        tagEntries = [];
    }
    // Function to determine what to display in the tag
    const renderTagContent = (entry) => {
        if (entry && typeof entry === "object") {
            return `${entry.duration} ${entry.timeframe}`;
        }
        else if (typeof entry === "object" && entry !== null) {
            return JSON.stringify(entry);
        }
        return entry;
    };
    return (<div className="card-dashed">
      <p className="text-sm mb-2 text-muted-400 dark:text-muted-600">
        {item.label || item.name}
      </p>
      <div className="flex flex-wrap gap-2">
        {tagEntries.map(([, value], index) => {
            const content = renderTagContent(value);
            return (<Tag_1.default key={index} variant="outlined" shape="smooth" color="default">
              {content}
            </Tag_1.default>);
        })}
      </div>
    </div>);
};
exports.Tags = TagsBase;
