"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Blocks_1 = __importDefault(require("../Menu/Blocks"));
const framer_motion_1 = require("framer-motion");
const builder_1 = __importDefault(require("@/stores/admin/builder"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const lodash_1 = require("lodash");
const toolbar_1 = require("../../toolbar");
const BuilderMenu = () => {
    const { sidebar, setSidebar } = (0, builder_1.default)();
    return (<framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: sidebar ? 240 : 0 }} transition={{ duration: 0.3 }} className="bg-muted-200 dark:bg-muted-850 overflow-hidden h-full">
      <div className="flex items-center justify-between p-4 border-b border-muted-300 dark:border-muted-800 bg-muted-50 dark:bg-muted-950">
        <div className="text-muted-800 dark:text-muted-400">
          {(0, lodash_1.capitalize)(sidebar)}
        </div>

        <IconButton_1.default size="sm" shape="full" onClick={() => {
            setSidebar("");
        }}>
          <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
        </IconButton_1.default>
      </div>
      <div className="overflow-y-auto slimscroll h-[calc(100%_-_50px)]">
        {/* {sidebar === "ELEMENTS" && <Elements />} */}
        {sidebar === "BLOCKS" && <Blocks_1.default />}
        {sidebar === "TOOLBAR" && <toolbar_1.Toolbar />}
      </div>
    </framer_motion_1.motion.div>);
};
exports.default = BuilderMenu;
