"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AppOverlay_1 = __importDefault(require("@/components/widgets/AppOverlay"));
const MenuContext_1 = require("@/context/MenuContext");
const AppNavbar_1 = require("../shared/sidebar/AppNavbar");
const Menu_1 = require("../shared/sidebar/Menu");
const HeaderPanels_1 = require("../shared/HeaderPanels");
const SideblockProvider = ({ fullwidth = false, horizontal = false, }) => {
    return (<>
      <MenuContext_1.MenuContextProvider>
        <Menu_1.Menu sideblock/>
      </MenuContext_1.MenuContextProvider>

      <AppNavbar_1.AppNavbar fullwidth={fullwidth ? fullwidth : false} horizontal={horizontal ? horizontal : false} sideblock/>

      <HeaderPanels_1.HeaderPanels />

      <AppOverlay_1.default />
    </>);
};
exports.default = SideblockProvider;
