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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const react_2 = require("@iconify/react");
const ContextMenu = ({ commands, children }) => {
    const [menuPosition, setMenuPosition] = (0, react_1.useState)({ x: 0, y: 0, visible: false });
    const menuRef = (0, react_1.useRef)(null);
    const handleRightClick = (event) => {
        event.preventDefault();
        setMenuPosition({
            x: event.clientX,
            y: event.clientY,
            visible: true,
        });
    };
    const handleOutsideClick = (event) => {
        if (menuRef.current &&
            !menuRef.current.contains(event.target) &&
            menuPosition.visible) {
            setMenuPosition({ ...menuPosition, visible: false });
        }
    };
    (0, react_1.useEffect)(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [menuPosition.visible]);
    const closeMenu = () => setMenuPosition({ ...menuPosition, visible: false });
    return (<div onContextMenu={handleRightClick} className="relative">
      {children}
      {menuPosition.visible &&
            (0, react_dom_1.createPortal)(<div ref={menuRef} style={{
                    position: "absolute",
                    top: menuPosition.y,
                    left: menuPosition.x,
                    zIndex: 200,
                }} className="bg-white/90 dark:bg-muted-950/90 text-sm shadow-lg rounded-tl-none rounded-lg p-1">
            <ul className="list-none m-0 p-0">
              {commands.map((command, index) => (<li key={index} className="cursor-pointer p-2 hover:bg-muted-100 dark:hover:bg-muted-700 flex items-center rounded-md text-muted-700 dark:text-muted-300" onClick={() => {
                        var _a;
                        (_a = command.onClick) === null || _a === void 0 ? void 0 : _a.call(command);
                        closeMenu();
                    }}>
                  {command.icon && (<react_2.Icon icon={command.icon} className="mr-2 w-5 h-5 text-muted-500 dark:text-muted-300"/>)}
                  {command.label}
                </li>))}
            </ul>
          </div>, document.body // Render menu in a portal
            )}
    </div>);
};
exports.default = ContextMenu;
