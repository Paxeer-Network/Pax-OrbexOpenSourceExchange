"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Menu_1 = require("../shared/sidebar/Menu");
const AppOverlay_1 = __importDefault(require("@/components/widgets/AppOverlay"));
const AppNavbar_1 = require("../shared/sidebar/AppNavbar");
const IconSidebar_1 = __importDefault(require("../shared/sidebar/IconSidebar"));
const MenuContext_1 = require("@/context/MenuContext");
const HeaderPanels_1 = require("../shared/HeaderPanels");
const SidebarPanelFloatProvider = ({ fullwidth = false, horizontal = false, nopush = false, }) => {
    return (<>
      <IconSidebar_1.default float/>

      <MenuContext_1.MenuContextProvider>
        <Menu_1.Menu float/>
      </MenuContext_1.MenuContextProvider>

      <AppNavbar_1.AppNavbar fullwidth={fullwidth ? fullwidth : false} horizontal={horizontal ? horizontal : false} nopush={nopush ? nopush : false}/>

      <HeaderPanels_1.HeaderPanels />

      <AppOverlay_1.default />
    </>);
};
exports.default = SidebarPanelFloatProvider;
