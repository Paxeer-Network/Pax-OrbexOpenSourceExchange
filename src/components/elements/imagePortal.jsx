"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@iconify/react");
const react_dom_1 = __importDefault(require("react-dom"));
const MashImage_1 = require("./MashImage");
const ImagePortal = ({ src, onClose }) => {
    if (!src)
        return null;
    const portalRoot = document.getElementById("portal-root");
    return react_dom_1.default.createPortal(<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose} style={{ backdropFilter: "blur-sm(5px)" }}>
      <div className="rounded-lg shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <MashImage_1.MashImage src={src} alt="Preview" className="rounded-lg max-h-[80vh] max-w-[80vw] object-contain"/>
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          <react_1.Icon icon="eva:close-fill" className="text-2xl"/>
        </button>
      </div>
    </div>, portalRoot || document.body);
};
exports.default = ImagePortal;
