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
// components/Loading.tsx
const dashboard_1 = require("@/stores/dashboard");
const react_1 = __importStar(require("react"));
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "light";
const Loading = () => {
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const [skeletonProps, setSkeletonProps] = (0, react_1.useState)({
        baseColor: defaultTheme === "dark" ? "#27272a" : "#f7fafc",
        highlightColor: defaultTheme === "dark" ? "#3a3a3e" : "#edf2f7",
    });
    (0, react_1.useEffect)(() => {
        setSkeletonProps({
            baseColor: isDark ? "#27272a" : "#f7fafc",
            highlightColor: isDark ? "#3a3a3e" : "#edf2f7",
        });
    }, [isDark]);
    return (<div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <react_loading_skeleton_1.default height={40} width={300} {...skeletonProps}/>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <react_loading_skeleton_1.default height={40} width="100%" {...skeletonProps}/>
      </div>

      {/* Navigation Menu */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {Array(5)
            .fill("")
            .map((_, index) => (<react_loading_skeleton_1.default key={index} height={40} width={100} style={{ marginRight: "10px" }} {...skeletonProps}/>))}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Array(8)
            .fill("")
            .map((_, index) => (<div key={index} style={{ width: "calc(25% - 20px)" }}>
              <react_loading_skeleton_1.default height={180} {...skeletonProps}/>
              <div style={{ marginTop: "10px" }}>
                <react_loading_skeleton_1.default height={20} width="80%" {...skeletonProps}/>
              </div>
              <div style={{ marginTop: "5px" }}>
                <react_loading_skeleton_1.default height={20} width="60%" {...skeletonProps}/>
              </div>
              <div style={{ marginTop: "5px" }}>
                <react_loading_skeleton_1.default height={20} width="40%" {...skeletonProps}/>
              </div>
            </div>))}
      </div>
    </div>);
};
exports.default = Loading;
