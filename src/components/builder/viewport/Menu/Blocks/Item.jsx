"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/Item.tsx
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const lodash_1 = require("lodash");
const Block_1 = __importDefault(require("@/components/builder/shared/Block"));
const html_1 = require("@/components/builder/utils/html");
const node_html_parser_1 = require("node-html-parser");
const Item = ({ connectors, c, move, children }) => {
    const root = (0, html_1.cleanHTMLElement)((0, node_html_parser_1.parse)(c.source));
    const id = (0, lodash_1.uniqueId)();
    return (<div ref={(ref) => connectors.create(ref, <core_1.Element is={Block_1.default} key={id} canvas root={root}/>)}>
      <a style={{ cursor: move ? "move" : "pointer" }} className="relative w-full cursor-pointer text-muted-800 dark:text-muted-200 hover:text-muted-800 transition-all gap-2 text-sm">
        {children}
      </a>
    </div>);
};
exports.default = Item;
