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
exports.FormModal = void 0;
const react_1 = __importStar(require("react"));
const Modal_1 = __importDefault(require("../../modal/Modal"));
const Button_1 = __importDefault(require("../../button/Button"));
const Card_1 = __importDefault(require("../../card/Card"));
const IconButton_1 = __importDefault(require("../../button-icon/IconButton"));
const react_2 = require("@iconify/react");
const datatable_1 = require("@/stores/datatable");
const pluralize_1 = __importDefault(require("pluralize"));
const FormRenderer_1 = require("./FormRenderer");
const next_i18next_1 = require("next-i18next");
const FormModalBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { modalAction, activeModal, closeModal, handleSubmit, props } = (0, datatable_1.useDataTable)((state) => state);
    const [formValues, setFormValues] = (0, react_1.useState)({});
    return (<Modal_1.default open={!!activeModal} size={(props === null || props === void 0 ? void 0 : props.formSize) || (modalAction === null || modalAction === void 0 ? void 0 : modalAction.modelSize)}>
      <Card_1.default shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            {modalAction === null || modalAction === void 0 ? void 0 : modalAction.label} {pluralize_1.default.singular(props === null || props === void 0 ? void 0 : props.title)}
          </p>
          <IconButton_1.default size="sm" shape="full" onClick={() => closeModal()}>
            <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
          </IconButton_1.default>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="p-4 md:px-6 md:py-8 overflow-y-auto max-h-[65vh]">
            <div className="mx-auto w-full space-y-4">
              <FormRenderer_1.FormRenderer formValues={formValues} setFormValues={setFormValues}/>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex w-full justify-end gap-2">
              <Button_1.default shape="smooth" onClick={() => closeModal()}>
                {t("Cancel")}
              </Button_1.default>
              <Button_1.default variant="solid" color="primary" shape="smooth" onClick={() => handleSubmit(formValues)}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </form>
      </Card_1.default>
    </Modal_1.default>);
};
exports.FormModal = FormModalBase;
