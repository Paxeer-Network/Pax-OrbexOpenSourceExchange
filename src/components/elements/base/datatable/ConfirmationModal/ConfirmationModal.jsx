"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationModal = void 0;
const Modal_1 = __importDefault(require("../../modal/Modal"));
const Button_1 = __importDefault(require("../../button/Button"));
const Card_1 = __importDefault(require("../../card/Card"));
const IconButton_1 = __importDefault(require("../../button-icon/IconButton"));
const react_1 = require("@iconify/react");
const datatable_1 = require("@/stores/datatable");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const ConfirmationModalBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { activeModal, handleDelete, handleBulkDelete, closeModal, fetchData } = (0, datatable_1.useDataTable)((state) => state);
    const router = (0, router_1.useRouter)();
    const isLog = router.pathname.includes("/admin/system/log");
    const modalConfig = {
        Confirm: {
            title: "Confirm action",
            description: "Are you sure you want to perform this action?",
            onConfirm: () => {
                fetchData();
                closeModal();
            },
        },
        Delete: {
            title: "Delete this record?",
            description: "Are you sure you want to remove this record? Make sure you don‘t need it anymore as it will be deleted and you won‘t be able to recover it.",
            onConfirm: () => isLog
                ? handleDelete(undefined, undefined, true, router.query)
                : handleDelete(),
        },
        Restore: {
            title: "Restore this record?",
            description: "Are you sure you want to restore this record? It will be available again in the list.",
            isRestoring: true,
            onConfirm: () => handleDelete(true),
        },
        PermanentDelete: {
            title: "Permanently delete this record?",
            description: "Are you sure you want to permanently delete this record? It will be removed from the system and you won't be able to recover it.",
            onConfirm: () => handleDelete(false, true),
        },
        BulkDelete: {
            title: "Delete selected records?",
            description: "Are you sure you want to delete the selected records? Make sure you don't need them anymore as they will be deleted and you won't be able to recover them.",
            onConfirm: () => isLog
                ? handleBulkDelete(undefined, undefined, true, router.query)
                : handleBulkDelete(),
        },
        BulkRestore: {
            title: "Restore selected records?",
            description: "Are you sure you want to restore the selected records? They will be available again in the list.",
            isRestoring: true,
            onConfirm: () => handleBulkDelete(true),
        },
        BulkPermanentDelete: {
            title: "Permanently delete selected records?",
            description: `Are you sure you want to permanently delete the selected records? They will be removed from the system and you won't be able to recover them.`,
            onConfirm: () => handleBulkDelete(false, true),
        },
    };
    const config = activeModal ? modalConfig[activeModal] || {} : {};
    return (<Modal_1.default open={!!activeModal} size="md">
      <Card_1.default shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            {config.title}
          </p>
          <IconButton_1.default size="sm" shape="full" onClick={() => closeModal()}>
            <react_1.Icon icon="lucide:x" className="h-4 w-4"/>
          </IconButton_1.default>
        </div>
        <div className="p-4 md:px-6 md:py-8">
          <div className="mx-auto w-full">
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400">
              {config.description}
            </p>
          </div>
        </div>
        <div className="p-4 md:p-6 ">
          <div className="flex w-full justify-end gap-2">
            <Button_1.default shape="smooth" onClick={() => closeModal()}>
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default variant="solid" color={config.isRestoring ? "warning" : "danger"} shape="smooth" onClick={() => config.onConfirm()}>
              {t("Confirm")}
            </Button_1.default>
          </div>
        </div>
      </Card_1.default>
    </Modal_1.default>);
};
exports.ConfirmationModal = ConfirmationModalBase;
