"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const InputFileProfile = ({ id, value, preview, previewSize = "lg", previewIcon = "fluent:person-24-filled", acceptedFileTypes = ["image/*"], color = "default", shape = "full", onRemoveFile, ...props }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className={`relative inline-flex items-center justify-center border-2 border-muted-300 dark:border-muted-700
          ${shape === "rounded-sm" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-full" : ""}
      `}>
      <input type="file" id={id} name={id} accept={acceptedFileTypes ? acceptedFileTypes.join(",") : undefined} {...props} className={`absolute inset-0 z-2 h-full w-full cursor-pointer opacity-0 ${value ? "pointer-events-none" : ""}`}/>
      <Avatar_1.default size={previewSize} shape={shape} src={preview} text="">
        {value || preview ? ("") : (<div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-muted-500 dark:text-muted-600">
            <react_2.Icon icon={previewIcon} className={`
              ${previewSize === "lg" ? "h-8 w-8" : ""} 
              ${previewSize === "xl" ? "h-10 w-10" : ""}
            `}/>
          </div>)}
      </Avatar_1.default>

      {value ? (<div className={`absolute 
            ${previewSize === "lg" ? "bottom-0 right-0" : ""}
            ${previewSize === "xl" ? "bottom-0.5 right-0.5" : ""}
          `} onClick={() => {
                onRemoveFile === null || onRemoveFile === void 0 ? void 0 : onRemoveFile();
            }}>
          <Tooltip_1.Tooltip content={t("Remove file")} position="top">
            <IconButton_1.default shape="full" size="sm">
              <react_2.Icon icon="lucide:x" className="h-3 w-3"/>
            </IconButton_1.default>
          </Tooltip_1.Tooltip>
        </div>) : ("")}

      {!value ? (<label htmlFor={id} className={`absolute 
            ${previewSize === "lg" ? "bottom-0 right-0" : ""}
            ${previewSize === "xl" ? "bottom-0.5 right-0.5" : ""}
          `}>
          <Tooltip_1.Tooltip content={t("Add picture")} position="top">
            <IconButton_1.default color={color} shape="full" size="sm">
              <react_2.Icon icon="lucide:plus" className="h-4 w-4"/>
            </IconButton_1.default>
          </Tooltip_1.Tooltip>
        </label>) : ("")}
    </div>);
};
exports.default = InputFileProfile;
