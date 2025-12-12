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
exports.Resizer = void 0;
const core_1 = require("@craftjs/core");
const cn_1 = require("@/utils/cn");
const re_resizable_1 = require("re-resizable");
const react_1 = __importStar(require("react"));
const lodash_1 = require("lodash");
const numToMeasurement_1 = require("@/utils/numToMeasurement");
const Indicators = ({ bound }) => {
    const indicatorStyles = {
        position: "absolute",
        width: "10px",
        height: "10px",
        background: "#fff",
        borderRadius: "100%",
        display: "block",
        boxShadow: "0px 0px 12px -1px rgba(0, 0, 0, 0.25)",
        zIndex: 99999,
        pointerEvents: "none",
        border: "2px solid #36a9e0",
    };
    const getPositionStyle = (index) => {
        switch (index) {
            case 1:
                return bound
                    ? bound === "row"
                        ? { left: "50%", top: "-5px", transform: "translateX(-50%)" }
                        : { top: "50%", left: "-5px", transform: "translateY(-50%)" }
                    : { left: "-5px", top: "-5px" };
            case 2:
                return {
                    right: "-5px",
                    top: "-5px",
                    display: bound ? "none" : "block",
                };
            case 3:
                return bound
                    ? bound === "row"
                        ? { left: "50%", bottom: "-5px", transform: "translateX(-50%)" }
                        : { bottom: "50%", left: "-5px", transform: "translateY(-50%)" }
                    : { left: "-5px", bottom: "-5px" };
            case 4:
                return {
                    bottom: "-5px",
                    right: "-5px",
                    display: bound ? "none" : "block",
                };
            default:
                return {};
        }
    };
    return (<div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
        }}>
      {Array.from({ length: 4 }).map((_, index) => (<span key={index} style={{ ...indicatorStyles, ...getPositionStyle(index + 1) }}></span>))}
    </div>);
};
exports.Resizer = react_1.default.forwardRef(({ propKey, children, ...props }, ref) => {
    const { id, actions: { setProp }, connectors: { connect }, fillSpace, nodeWidth, nodeHeight, parent, active, inNodeContext, } = (0, core_1.useNode)((node) => ({
        parent: node.data.parent,
        active: node.events.selected,
        nodeWidth: node.data.props[propKey.width],
        nodeHeight: node.data.props[propKey.height],
        fillSpace: node.data.props.fillSpace,
    }));
    const { isRootNode, parentDirection } = (0, core_1.useEditor)((state, query) => {
        return {
            parentDirection: parent &&
                state.nodes[parent] &&
                state.nodes[parent].data.props.flexDirection,
            isRootNode: query.node(id).isRoot(),
        };
    });
    const resizable = (0, react_1.useRef)(null);
    const isResizing = (0, react_1.useRef)(false);
    const editingDimensions = (0, react_1.useRef)(null);
    const nodeDimensions = (0, react_1.useRef)(null);
    nodeDimensions.current = { width: nodeWidth, height: nodeHeight };
    /**
     * Using an internal value to ensure the width/height set in the node is converted to px
     * because for some reason the <re-resizable /> library does not work well with percentages.
     */
    const [internalDimensions, setInternalDimensions] = (0, react_1.useState)({
        width: nodeWidth,
        height: nodeHeight,
    });
    const updateInternalDimensionsInPx = (0, react_1.useCallback)(() => {
        const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
        const width = (0, numToMeasurement_1.percentToPx)(nodeWidth, resizable.current &&
            (0, numToMeasurement_1.getElementDimensions)(resizable.current.resizable.parentElement).width);
        const height = (0, numToMeasurement_1.percentToPx)(nodeHeight, resizable.current &&
            (0, numToMeasurement_1.getElementDimensions)(resizable.current.resizable.parentElement).height);
        setInternalDimensions({
            width,
            height,
        });
    }, []);
    const updateInternalDimensionsWithOriginal = (0, react_1.useCallback)(() => {
        const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
        setInternalDimensions({
            width: nodeWidth,
            height: nodeHeight,
        });
    }, []);
    const getUpdatedDimensions = (width, height) => {
        const dom = resizable.current.resizable;
        if (!dom)
            return;
        const currentWidth = parseInt(editingDimensions.current.width), currentHeight = parseInt(editingDimensions.current.height);
        return {
            width: currentWidth + parseInt(width),
            height: currentHeight + parseInt(height),
        };
    };
    (0, react_1.useEffect)(() => {
        if (!isResizing.current)
            updateInternalDimensionsWithOriginal();
    }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);
    (0, react_1.useEffect)(() => {
        const listener = (0, lodash_1.debounce)(updateInternalDimensionsWithOriginal, 1);
        window.addEventListener("resize", listener);
        return () => {
            window.removeEventListener("resize", listener);
        };
    }, [updateInternalDimensionsWithOriginal]);
    return (<re_resizable_1.Resizable enable={[
            "top",
            "left",
            "bottom",
            "right",
            "topLeft",
            "topRight",
            "bottomLeft",
            "bottomRight",
        ].reduce((acc, key) => {
            acc[key] = active && inNodeContext;
            return acc;
        }, {})} className={(0, cn_1.cn)([
            {
                "m-auto": isRootNode,
                flex: true,
            },
        ])} ref={(ref) => {
            if (ref) {
                resizable.current = ref;
                connect(resizable.current.resizable);
            }
        }} size={internalDimensions} onResizeStart={(e) => {
            updateInternalDimensionsInPx();
            e.preventDefault();
            e.stopPropagation();
            const dom = resizable.current.resizable;
            if (!dom)
                return;
            editingDimensions.current = {
                width: dom.getBoundingClientRect().width,
                height: dom.getBoundingClientRect().height,
            };
            isResizing.current = true;
        }} onResize={(_, __, ___, d) => {
            const dom = resizable.current.resizable;
            let { width, height } = getUpdatedDimensions(d.width, d.height);
            if ((0, numToMeasurement_1.isPercentage)(nodeWidth))
                width =
                    (0, numToMeasurement_1.pxToPercent)(width, (0, numToMeasurement_1.getElementDimensions)(dom.parentElement).width) + "%";
            else
                width = `${width}px`;
            if ((0, numToMeasurement_1.isPercentage)(nodeHeight))
                height =
                    (0, numToMeasurement_1.pxToPercent)(height, (0, numToMeasurement_1.getElementDimensions)(dom.parentElement).height) + "%";
            else
                height = `${height}px`;
            if ((0, numToMeasurement_1.isPercentage)(width) && dom.parentElement.style.width === "auto") {
                width = editingDimensions.current.width + d.width + "px";
            }
            if ((0, numToMeasurement_1.isPercentage)(height) &&
                dom.parentElement.style.height === "auto") {
                height = editingDimensions.current.height + d.height + "px";
            }
            setProp((prop) => {
                prop[propKey.width] = width;
                prop[propKey.height] = height;
            }, 500);
        }} onResizeStop={() => {
            isResizing.current = false;
            updateInternalDimensionsWithOriginal();
        }} {...props}>
        {children}
        {active && (<Indicators bound={fillSpace === "yes" ? parentDirection : false}></Indicators>)}
      </re_resizable_1.Resizable>);
});
exports.Resizer.displayName = "Resizer";
exports.default = exports.Resizer;
