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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const core_1 = require("@craftjs/core");
const react_dom_1 = __importDefault(require("react-dom"));
const LinkDialog_1 = __importDefault(require("../shared/LinkDialog"));
const ImageDialog_1 = __importDefault(require("../shared/ImageDialog"));
const ButtonDialog_1 = __importDefault(require("../shared/ButtonDialog"));
const HashtagDialog_1 = __importDefault(require("../shared/HashtagDialog"));
const SvgDialog_1 = __importDefault(require("../shared/SvgDialog"));
const builder_1 = __importDefault(require("@/stores/admin/builder"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const react_2 = require("@iconify/react");
const EditorElement = ({ render }) => {
    const { id } = (0, core_1.useNode)();
    const { actions, query, isActive, enabled } = (0, core_1.useEditor)((state, query) => ({
        isActive: query.getEvent("selected").contains(id),
        enabled: state.options.enabled,
    }));
    const { node, data, isHover, dom, name, moveable, deletable, connectors: { drag }, parent, isRootChild, showFocus, } = (0, core_1.useNode)((node) => ({
        node: node,
        data: node.data,
        isHover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: query.node(node.id).isDeletable(),
        parent: node.data.parent,
        isRootChild: node.data.parent === "ROOT",
        showFocus: node.id !== "ROOT" && node.data.displayName !== "App",
    }));
    const currentRef = (0, react_1.useRef)(null);
    const { setSidebar } = (0, builder_1.default)();
    (0, react_1.useEffect)(() => {
        if (dom) {
            // const handleClick = () => setSidebar("TOOLBAR");
            dom.classList.toggle("component-selected", isActive || isHover);
            // dom.addEventListener("click", handleClick);
            // return () => {
            //   dom.removeEventListener("click", handleClick);
            // };
        }
    }, [dom, isActive, isHover, setSidebar]);
    const getPos = (0, react_1.useCallback)((dom) => {
        const rect = dom === null || dom === void 0 ? void 0 : dom.getBoundingClientRect();
        const top = (rect === null || rect === void 0 ? void 0 : rect.top) + window.scrollY;
        const left = (rect === null || rect === void 0 ? void 0 : rect.left) + window.scrollX;
        return { top: `${top}px`, left: `${left}px` };
    }, []);
    const scroll = (0, react_1.useCallback)(() => {
        if (!currentRef.current || !dom)
            return;
        const { top, left } = getPos(dom);
        currentRef.current.style.top = top;
        currentRef.current.style.left = left;
    }, [dom, getPos]);
    (0, react_1.useEffect)(() => {
        const el = document.querySelector(".craftjs-renderer");
        el === null || el === void 0 ? void 0 : el.addEventListener("scroll", scroll);
        return () => {
            el === null || el === void 0 ? void 0 : el.removeEventListener("scroll", scroll);
        };
    }, [scroll]);
    const [openLink, setOpenLink] = (0, react_1.useState)(false);
    const [openImage, setOpenImage] = (0, react_1.useState)(false);
    const [openButton, setOpenButton] = (0, react_1.useState)(false);
    const [openHash, setOpenHash] = (0, react_1.useState)(false);
    const [openSvg, setOpenSvg] = (0, react_1.useState)(false);
    const handleMouseDown = (0, react_1.useCallback)((event, setOpen) => {
        event.stopPropagation();
        setOpen(true);
    }, []);
    const handleDelete = (e) => {
        e.stopPropagation();
        actions.delete(id);
    };
    return (<>
      {isHover || isActive
            ? react_dom_1.default.createPortal(<div ref={currentRef} className="px-1 py-1 fixed flex gap-1 items-center just text-muted-900 rounded-t border-x border-t border-info-500 border-dashed" style={{
                    left: dom ? getPos(dom).left : "0px",
                    top: dom ? getPos(dom).top : "0px",
                    zIndex: 9999,
                    height: "24px",
                    marginTop: "-23px",
                    fontSize: "12px",
                    lineHeight: "12px",
                }}>
              <h2 className="flex-1 mr-4 bg-muted-100 p-1 rounded-xs">
                {name}
              </h2>
              {moveable && (<Tooltip_1.Tooltip content="Move" position="bottom">
                  <a className="cursor-move flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" ref={(e) => {
                        if (e)
                            drag(e);
                    }}>
                    <react_2.Icon icon="mdi:cursor-move" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {isRootChild && (<Tooltip_1.Tooltip content="Hashtag" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onMouseDown={(e) => handleMouseDown(e, setOpenHash)}>
                    <react_2.Icon icon="mdi:hashtag" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {showFocus && (<Tooltip_1.Tooltip content="Parent" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onClick={() => {
                        var _a;
                        actions.selectNode((_a = data.parent) !== null && _a !== void 0 ? _a : undefined);
                    }}>
                    <react_2.Icon icon="mdi:arrow-up" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {(dom === null || dom === void 0 ? void 0 : dom.nodeName) === "IMG" && (<Tooltip_1.Tooltip content="Image" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onMouseDown={(e) => handleMouseDown(e, setOpenImage)}>
                    <react_2.Icon icon="mdi:image" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {(dom === null || dom === void 0 ? void 0 : dom.nodeName) === "svg" && (<Tooltip_1.Tooltip content="SVG" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onMouseDown={(e) => handleMouseDown(e, setOpenSvg)}>
                    <react_2.Icon icon="mdi:image" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {(dom === null || dom === void 0 ? void 0 : dom.nodeName) === "A" && (<Tooltip_1.Tooltip content="Link" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onMouseDown={(e) => handleMouseDown(e, setOpenLink)}>
                    <react_2.Icon icon="mdi:link" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {(dom === null || dom === void 0 ? void 0 : dom.nodeName) === "BUTTON" && (<Tooltip_1.Tooltip content="Button" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onMouseDown={(e) => handleMouseDown(e, setOpenButton)}>
                    <react_2.Icon icon="dashicons:button" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              {deletable && (<Tooltip_1.Tooltip content="Delete" position="bottom">
                  <a className="cursor-pointer flex items-center hover:bg-muted-200 rounded-sm p-1 bg-muted-100/40 transition-colors duration-200" onMouseDown={handleDelete}>
                    <react_2.Icon icon="mdi:trash-can-outline" className="h-4 w-4"/>
                  </a>
                </Tooltip_1.Tooltip>)}
              <LinkDialog_1.default open={openLink} setOpen={setOpenLink} node={node} actions={actions}/>
              <ImageDialog_1.default open={openImage} setOpen={setOpenImage} node={node} actions={actions}/>
              <HashtagDialog_1.default open={openHash} setOpen={setOpenHash} node={node} actions={actions}/>
              <SvgDialog_1.default open={openSvg} setOpen={setOpenSvg} node={node} actions={actions}/>
              <ButtonDialog_1.default open={openButton} setOpen={setOpenButton} node={node} actions={actions}/>
            </div>, document.querySelector(".page-container"))
            : null}
      {render}
    </>);
};
exports.default = EditorElement;
