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
exports.Viewport = void 0;
const core_1 = require("@craftjs/core");
const cn_1 = require("@/utils/cn");
const react_1 = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const Logo_1 = __importDefault(require("@/components/vector/Logo"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const router_1 = require("next/router");
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const lzutf8_1 = __importDefault(require("lzutf8"));
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const sonner_1 = require("sonner");
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const builder_1 = __importDefault(require("@/stores/admin/builder"));
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const BuilderSidebarIcon_1 = __importDefault(require("./Sidebar/BuilderSidebarIcon"));
const BuilderMenu_1 = __importDefault(require("./Sidebar/BuilderMenu"));
const Viewport = ({ children, }) => {
    const router = (0, router_1.useRouter)();
    const { saveEditorState } = (0, builder_1.default)();
    const { enabled, connectors, canUndo, canRedo, actions, query } = (0, core_1.useEditor)((state, query) => ({
        enabled: state.options.enabled,
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo(),
    }));
    const containerRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [stateToLoad, setStateToLoad] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (!window)
            return;
        window.requestAnimationFrame(() => {
            window.parent.postMessage({ LANDING_PAGE_LOADED: true }, "*");
            setTimeout(() => {
                actions.setOptions((options) => {
                    options.enabled = true;
                });
            }, 200);
        });
    }, [actions.setOptions]);
    (0, react_1.useEffect)(() => {
        if (containerRef.current) {
            connectors.select(connectors.hover(containerRef.current, ""), "");
        }
    }, [connectors]);
    const handleSave = async () => {
        const json = query.serialize();
        const content = lzutf8_1.default.encodeBase64(lzutf8_1.default.compress(json));
        saveEditorState(content);
    };
    const handleCopyState = () => {
        const json = query.serialize();
        (0, copy_to_clipboard_1.default)(lzutf8_1.default.encodeBase64(lzutf8_1.default.compress(json)));
        sonner_1.toast.success("State copied to clipboard");
    };
    const handleLoadState = () => {
        if (stateToLoad.trim()) {
            try {
                const json = lzutf8_1.default.decompress(lzutf8_1.default.decodeBase64(stateToLoad));
                actions.deserialize(json);
                sonner_1.toast.success("State loaded successfully");
            }
            catch (error) {
                sonner_1.toast.error("Failed to load state");
            }
        }
        else {
            sonner_1.toast.error("Please paste a valid state to load");
        }
    };
    return (<div className={`viewport flex h-full overflow-hidden flex-col w-full fixed`}>
      <nav className={`fixed h-full left-0 top-0 z-50 w-20 overflow-visible border border-muted-200 bg-white transition-all duration-300 dark:border-muted-800 dark:bg-muted-950 lg:translate-x-0`}>
        <div className="h-full flex justify-between flex-col z-50">
          <ul>
            <li className="relative mb-2 flex h-20 w-full items-center justify-center">
              <link_1.default href="/" className="relative flex h-10 w-10 mt-2 items-center justify-center text-sm no-underline transition-all duration-100 ease-linear">
                <Logo_1.default className="-mt-[5px] h-7 w-7 text-primary-500 transition-opacity duration-300 hover:opacity-80"/>
              </link_1.default>
            </li>
            {/* <BuilderSidebarIcon
          icon="solar:add-square-bold-duotone"
          name="ELEMENTS"
        /> */}
            <BuilderSidebarIcon_1.default icon="solar:layers-bold-duotone" name="BLOCKS"/>
          </ul>
          <div className="mt-auto my-3 w-full flex items-center flex-col gap-4">
            <div className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20" onClick={() => {
            router.push("/admin/dashboard");
        }}>
              <react_2.Icon icon={"mdi:chevron-left"} className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 hover:group-dark:text-primary-500"/>
            </div>
            <div className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20">
              <ThemeSwitcher_1.default />
            </div>
            <Tooltip_1.Tooltip content="View" position="end">
              <div className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20" onClick={() => {
            actions.setOptions((options) => (options.enabled = !enabled));
        }}>
                <react_2.Icon icon={enabled
            ? "solar:eye-bold-duotone"
            : "solar:pen-2-bold-duotone"} className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 hover:group-dark:text-primary-500"/>
              </div>
            </Tooltip_1.Tooltip>
            <Tooltip_1.Tooltip content="Save" position="end">
              <div className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20" onClick={() => {
            handleSave();
        }}>
                <react_2.Icon icon={"solar:check-read-line-duotone"} className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 hover:group-dark:text-primary-500"/>
              </div>
            </Tooltip_1.Tooltip>
            <Tooltip_1.Tooltip content="Import/Export" position="end">
              <div className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20" onClick={() => {
            setOpen(true);
        }}>
                <react_2.Icon icon="solar:cloud-upload-line-duotone" className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 hover:group-dark:text-primary-500"/>
              </div>
            </Tooltip_1.Tooltip>
          </div>
        </div>
      </nav>
      <div className="flex flex-1 h-full bg-muted-100 dark:bg-muted-900 w-full">
        <div className="h-full ms-20 z-12">
          <BuilderMenu_1.default />
        </div>
        <div className="page-container relative flex-1 h-full transition-all duration-300">
          <div className={(0, cn_1.cn)([
            "craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto slimscroll px-8",
            { "bg-muted-100 dark:bg-muted-800": enabled },
        ])} ref={(ref) => {
            connectors.select(connectors.hover(ref, ""), "");
        }}>
            <div className="relative flex-col flex items-center pt-8">
              {children}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 z-20">
            <div className="flex gap-2 px-2 pt-[5px] pb-[2px] bg-white dark:bg-muted-800 border-t border-s border-muted-300 dark:border-muted-700 rounded-tl-md">
              <Tooltip_1.Tooltip content="Undo" position="bottom">
                <IconButton_1.default shape={"rounded-sm"} size={"sm"} variant={"solid"} color={"muted"} className={(0, cn_1.cn)({
            "opacity-50 cursor-not-allowed": !canUndo,
        })} onClick={() => actions.history.undo()}>
                  <react_2.Icon icon="solar:undo-left-line-duotone" className="h-6 w-6 text-muted-800 dark:text-muted-200"/>
                </IconButton_1.default>
              </Tooltip_1.Tooltip>
              <Tooltip_1.Tooltip content="Redo" position="bottom">
                <IconButton_1.default shape={"rounded-sm"} size={"sm"} variant={"solid"} color={"muted"} className={(0, cn_1.cn)({
            "opacity-50 cursor-not-allowed": !canRedo,
        })} onClick={() => actions.history.redo()}>
                  <react_2.Icon icon="solar:undo-right-line-duotone" className="h-6 w-6 text-muted-800 dark:text-muted-200"/>
                </IconButton_1.default>
              </Tooltip_1.Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Import/Export Modal */}
      <Modal_1.default open={open} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              Import/Export State
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => {
            setOpen(false);
        }}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4 dark:text-white"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:px-6 md:py-8">
            <div className="mx-auto w-full max-w-xs">
              <Textarea_1.default rows={5} label="Paste the compressed state here" placeholder="Paste here" value={stateToLoad} onChange={(e) => setStateToLoad(e.target.value)}/>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button_1.default shape="smooth" onClick={handleLoadState}>
                Import
              </Button_1.default>
              <Button_1.default variant="outlined" shape="smooth" onClick={handleCopyState}>
                Export
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>
    </div>);
};
exports.Viewport = Viewport;
exports.default = exports.Viewport;
