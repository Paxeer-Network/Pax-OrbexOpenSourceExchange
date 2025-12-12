"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@iconify/react");
const react_dom_1 = __importDefault(require("react-dom"));
const Portal = ({ children, onClose }) => {
    if (!children)
        return null;
    const portalRoot = document.getElementById("portal-root");
    return react_dom_1.default.createPortal(<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose} style={{ backdropFilter: "blur-sm(5px)" }}>
      <div className="rounded-lg shadow-lg overflow-hidden relative bg-white dark:bg-muted-800" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-700 dark:text-muted-200">
          <react_1.Icon icon="eva:close-fill" className="text-2xl"/>
        </button>
      </div>
    </div>, portalRoot || document.body);
};
exports.default = Portal;
