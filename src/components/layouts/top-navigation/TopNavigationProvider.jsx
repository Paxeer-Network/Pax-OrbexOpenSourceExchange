"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AppNavbar_1 = __importDefault(require("./AppNavbar"));
const TopNavbar_1 = __importDefault(require("./TopNavbar"));
const react_responsive_1 = __importDefault(require("react-responsive"));
const breakpoints_1 = require("@/utils/breakpoints");
const HeaderPanels_1 = require("../shared/HeaderPanels");
const TopNavigationProvider = ({ fullwidth = false, horizontal = false, trading = false, transparent = false, }) => {
    return (<>
      <TopNavbar_1.default trading={trading} transparent={transparent}/>
      {!trading && (<react_responsive_1.default maxWidth={parseInt(breakpoints_1.breakpoints.lg) - 1}>
          <AppNavbar_1.default fullwidth={fullwidth} horizontal={horizontal}/>
        </react_responsive_1.default>)}
      <HeaderPanels_1.HeaderPanels />
    </>);
};
exports.default = TopNavigationProvider;
