"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const ClassNameTag = ({ name, onEdit, onRemove }) => (<Tag_1.default className="cursor-pointer relative" shape={"rounded-xs"}>
    <span onClick={onEdit}>{name}</span>
    <react_2.Icon icon="carbon:close-filled" className="text-red-500 hover:text-red-700 absolute -right-1 -top-1 cursor-pointer" onClick={(e) => {
        e.stopPropagation(); // Prevent triggering onEdit
        onRemove();
    }}/>
  </Tag_1.default>);
exports.default = ClassNameTag;
