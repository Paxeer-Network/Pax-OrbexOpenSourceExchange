"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
const core_1 = require("@craftjs/core");
const react_1 = __importDefault(require("react"));
__exportStar(require("./ToolbarItem"), exports);
__exportStar(require("./ToolbarSection"), exports);
__exportStar(require("./ToolbarTextInput"), exports);
__exportStar(require("./ToolbarDropdown"), exports);
const Toolbar = () => {
    const { active, related } = (0, core_1.useEditor)((state, query) => {
        const currentlySelectedNodeId = query.getEvent("selected").first();
        return {
            active: currentlySelectedNodeId,
            related: currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
        };
    });
    return (<div className="py-1 h-full slimscroll overflow-y-auto">
      {active && related.toolbar && (<div className="relative">{react_1.default.createElement(related.toolbar)}</div>)}
      {!active && (<div className="px-5 py-2 flex flex-col items-center h-full justify-center text-center text-muted-400" style={{
                fontSize: "11px",
            }}>
          <h2 className="pb-1">Click on a component to start editing.</h2>
          <h2>
            You could also double-click on the layers below to edit their names,
            like in Photoshop
          </h2>
        </div>)}
    </div>);
};
exports.Toolbar = Toolbar;
