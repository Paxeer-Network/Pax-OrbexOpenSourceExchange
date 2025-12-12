"use client";
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
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const datatable_1 = require("@/stores/datatable");
const MashImage_1 = require("@/components/elements/MashImage");
const Message_1 = __importDefault(require("../../base/message/Message"));
const Tooltip_1 = require("../../base/tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const getPreview = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});
function InputFile(props) {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { id, acceptedFileTypes, maxFileSize = 16, allowMultiple = false, label = "", labelAlt = "", shape = "smooth", color = "contrast", bordered = false, spaced = true, onChange, onRemoveFile, preview, previewPlaceholder, flex = "row", error, } = props;
    const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // MB to bytes
    const { setUploadStatus, setUploadError, resetUpload, fileUploadProgress, fileUploadStatus, uploadError, uploadSuccess, } = (0, datatable_1.useDataTable)();
    const isError = Object.values(fileUploadStatus).some((status) => status !== "Uploaded");
    (0, react_1.useEffect)(() => {
        setPreviews(preview ? [preview] : [previewPlaceholder]);
    }, [preview, previewPlaceholder]);
    const [previews, setPreviews] = (0, react_1.useState)([]);
    const [isDraggingOver, setIsDraggingOver] = (0, react_1.useState)(false);
    const fileInputRef = (0, react_1.useRef)(null);
    const handleFileChange = async (files) => {
        setUploadError(null);
        const filesArray = Array.from(files);
        for (const file of filesArray) {
            if (file.size > MAX_FILE_BYTES) {
                setUploadError(`File size cannot exceed ${maxFileSize} MB`);
                return setUploadStatus(file.name, "Error");
            }
            if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
                setUploadError(`File type not accepted. Accepted types: ${acceptedFileTypes.join(", ")}`);
                return setUploadStatus(file.name, "Error");
            }
        }
        try {
            const newPreviews = await Promise.all(filesArray.map((file) => getPreview(file)));
            setPreviews(newPreviews);
            onChange(filesArray);
        }
        catch (error) {
            console.error("Error generating previews:", error);
            setUploadError("Error processing files");
        }
    };
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
            handleFileChange(event.dataTransfer.files);
        }
        setIsDraggingOver(false);
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };
    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDraggingOver(false);
    };
    return (<div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`flex w-full flex-col gap-2
    ${isDraggingOver ? "bg-primary-100 border-primary-500" : "bg-muted-100"} 
    ${bordered && color === "default"
            ? "border border-muted-200 dark:border-muted-700"
            : ""}
    ${bordered && color === "contrast"
            ? "border border-muted-200 dark:border-muted-800"
            : ""}
    ${bordered && color === "muted"
            ? "border border-muted-200 dark:border-muted-700"
            : ""}
    ${bordered && color === "mutedContrast"
            ? "border border-muted-200 dark:border-muted-800"
            : ""}
    ${shape === "rounded-sm" ? "rounded-md" : ""}
    ${shape === "smooth" ? "rounded-lg" : ""}
    ${shape === "curved" ? "rounded-xl" : ""}
    ${shape === "full" ? "rounded-xl" : ""}
    ${color === "default" ? "bg-white dark:bg-muted-800" : ""}
    ${color === "contrast" ? "bg-white dark:bg-muted-900" : ""}
    ${color === "muted" ? "bg-muted-100 dark:bg-muted-800" : ""}
    ${color === "mutedContrast" ? "bg-muted-100 dark:bg-muted-900" : ""}
  `}>
      {uploadSuccess ? (<div className={`flex flex-col gap-2 py-3
          ${spaced ? "px-6" : ""}
        `}>
          {isError ? (<div className="mt-3 w-full text-center [&+div]:hidden">
              <IconBox_1.default icon="ph:plus-circle-duotone" variant="pastel" color="danger" className="mx-auto mb-2 rotate-45"/>
              <h3 className="mb-1 text-base font-light text-muted-800 dark:text-muted-100">
                {t("Upload error")}
              </h3>
              <p className="mx-auto max-w-[320px] text-sm text-muted-500 dark:text-muted-400">
                {t("Sorry, there was a problem uploading your file(s).")}
              </p>
            </div>) : (<></>)}
          <div className="mt-3 w-full text-center">
            <IconBox_1.default icon="ph:check-circle-duotone" variant="pastel" color="success" className="mx-auto mb-2"/>
            <h3 className="mb-1 text-base font-light text-muted-800 dark:text-muted-100">
              {t("Upload Complete")}
            </h3>
            <p className="mx-auto max-w-[320px] text-sm text-muted-500 dark:text-muted-400">
              {t("Great, your file(s) were successfully uploaded.")}
            </p>
          </div>
        </div>) : (<div className="w-full">
          <label className={`block pb-3 pt-6
            ${spaced ? "px-6" : ""}
          `}>
            <span className="block text-sm text-muted-500 dark:text-muted-400">
              {label}
            </span>
            <span className="block text-xs text-muted-500 dark:text-muted-400">
              {labelAlt}
            </span>
          </label>

          {!isError ? (<div className={`group flex w-full gap-4 justify-between flex-${flex}
              ${spaced ? "px-6" : ""}
            `}>
              <div className={`w-full relative border-2 border-dashed border-muted-300 bg-muted-50 p-5 dark:border-muted-700 dark:bg-muted-800
                ${shape === "rounded-sm" ? "rounded-md" : ""}
                ${shape === "smooth" ? "rounded-lg" : ""}
                ${shape === "curved" ? "rounded-xl" : ""}
                ${shape === "full" ? "rounded-xl" : ""}
            `}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" className="mx-auto mb-4 h-14 w-14 text-muted-400 transition-colors duration-300 group-hover:text-primary-500">
                  <g fill="none" stroke="currentColor" strokeLinejoin="round">
                    <path d="M2 14.5A4.5 4.5 0 0 0 6.5 19h12a3.5 3.5 0 0 0 .5-6.965a7 7 0 0 0-13.76-1.857A4.502 4.502 0 0 0 2 14.5Z"/>
                    <path strokeLinecap="round" d="m14 11l-2-2m0 0l-2 2m2-2v6"/>
                  </g>
                </svg>
                <div className="mx-auto flex max-w-xs flex-col text-center">
                  <label>
                    <input id={id} type="file" className="hidden w-36 cursor-pointer text-sm" onChange={(event) => handleFileChange(event.target.files)} accept={acceptedFileTypes
                    ? acceptedFileTypes.join(",")
                    : undefined} ref={fileInputRef} multiple={allowMultiple} // Added the 'multiple' attribute conditionally
            />
                    <label htmlFor={id} className={`mx-auto flex w-40 cursor-pointer items-center justify-center bg-primary-500 px-3 py-2 text-sm text-center font-normal text-white transition-colors duration-300 hover:bg-primary-400 active:bg-primary-500
                      ${shape === "rounded-sm" ? "rounded-md" : ""}
                      ${shape === "smooth" ? "rounded-lg" : ""}
                      ${shape === "curved" ? "rounded-xl" : ""}
                      ${shape === "full" ? "rounded-full" : ""}
                    `}>
                      {t("Select File")}
                      {allowMultiple ? "s" : ""}
                    </label>
                  </label>

                  <div className="mt-3 text-xs uppercase text-muted-500 dark:text-muted-400">
                    {t("or drop")} {allowMultiple ? "" : "a"} {t("file")}
                    {allowMultiple ? "s" : ""} {t("here")}
                  </div>
                </div>
              </div>
              {previews.length > 0 && (<div className={`relative border-2 border-dashed border-muted-300 bg-muted-50 p-5 dark:border-muted-700 dark:bg-muted-800
              ${shape === "rounded-sm" ? "rounded-md" : ""}
              ${shape === "smooth" ? "rounded-lg" : ""}
              ${shape === "curved" ? "rounded-xl" : ""}
              ${shape === "full" ? "rounded-xl" : ""}
          `}>
                  {previews.map((preview, index) => (<div key={index} className={`relative flex flex-col items-center justify-center w-32 h-32 bg-muted-50 dark:bg-muted-800 rounded-md
          ${shape === "rounded-sm" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-xl" : ""}
        `}>
                      {preview && (<MashImage_1.MashImage src={preview} alt="preview" fill className="object-cover w-full h-full rounded-md"/>)}
                      {preview !== previewPlaceholder && (<span className="absolute -top-2 -right-2">
                          <Tooltip_1.Tooltip content={t("Remove file")} position="top">
                            <button className=" bg-white rounded-full shadow-md transition-colors duration-300 hover:bg-danger-500 text-danger-500 hover:text-white" onClick={() => {
                                onRemoveFile && onRemoveFile(preview);
                                setPreviews((prev) => prev.filter((_, i) => i !== index));
                            }}>
                              <react_2.Icon icon="ph:x-circle-fill" className="w-6 h-6 "/>
                            </button>
                          </Tooltip_1.Tooltip>
                        </span>)}
                    </div>))}
                </div>)}
            </div>) : ("")}

          <label className="block px-6 pt-3">
            {uploadError && (<Message_1.default icon="ph:warning-octagon-duotone" color="danger" label={uploadError || ""} isFixed={false}/>)}
          </label>

          {error && (<span className="text-sm text-danger-500 mt-1 px-6 pt-3">
              {error}
            </span>)}
        </div>)}

      <div className={`flex flex-col-reverse gap-2 overflow-x-auto
        ${spaced ? "px-6" : ""}
      `}>
        {Object.entries(fileUploadProgress).map(([fileName, progress]) => (<div key={fileName} className="flex flex-col gap-1 text-xs">
            <p className="text-muted-500 dark:text-muted-400">{fileName}</p>
            <div className="flex h-6 items-center gap-2 rounded-full border border-muted-200 dark:border-muted-700 px-3  overflow-hidden">
              <Progress_1.default size="xs" value={progress}/>
              {progress === 100 ? (<>
                  {fileUploadStatus[fileName] === "Uploaded" ? (<react_2.Icon icon="ph:check-circle-duotone" className="-me-3 h-6 w-6 text-success-500"/>) : (<react_2.Icon icon="ph:plus-circle-duotone" className="-me-3 h-6 w-6 rotate-45 text-danger-500"/>)}
                </>) : ("")}
            </div>
            <p className="font-normal text-xs text-danger-500 mb-2">
              {fileUploadStatus[fileName] !== "Uploaded"
                ? fileUploadStatus[fileName]
                : ""}
            </p>
          </div>))}
      </div>
      <div>
        {uploadSuccess || isError ? (<div className={`pb-6
            ${spaced ? "px-6" : ""}
          `}>
            <Button_1.default shape={shape} color="muted" type="button" className="w-full" onClick={resetUpload}>
              {t("Upload Again")}
            </Button_1.default>
          </div>) : ("")}
      </div>
    </div>);
}
exports.default = InputFile;
