"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkSelectionMessage = void 0;
const Message_1 = __importDefault(require("../../message/Message"));
const Button_1 = __importDefault(require("../../button/Button"));
const react_1 = require("@iconify/react");
const datatable_1 = require("@/stores/datatable");
const next_i18next_1 = require("next-i18next");
const BulkSelectionMessageBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { clearSelection, selectedItems, navActionsState, handleAction } = (0, datatable_1.useDataTable)((state) => state);
    return (<Message_1.default onClose={clearSelection}>
      <div className="flex flex-col items-start sm:items-center justify-start sm:justify-between sm:flex-row gap-5 w-full">
        <div>
          <p className="text-sm font-normal leading-tight text-muted-800 dark:text-muted-100">
            {selectedItems.length} {t("item(s) selected")}
          </p>
          <p className="text-xs text-muted-400">
            {t("Click on an item to deselect it")}
          </p>
        </div>
        <div className="flex items-center gap-3 me-2">
          <Button_1.default variant="pastel" color="danger" size={"sm"} onClick={() => {
            handleAction({
                type: "modal",
                modalType: "confirmation",
                topic: navActionsState.showDeleted
                    ? "bulk-permanent-delete"
                    : "bulk-delete",
            });
        }}>
            <react_1.Icon icon={navActionsState.showDeleted
            ? "ph:trash-simple"
            : "ph:trash-duotone"} className="h-5 w-5 me-1"/>
            {navActionsState.showDeleted ? "Delete Permanently" : "Delete"}
          </Button_1.default>
          {navActionsState.showDeleted && (<Button_1.default variant="pastel" color="warning" size={"sm"} onClick={() => {
                handleAction({
                    type: "modal",
                    modalType: "confirmation",
                    topic: "bulk-restore",
                });
            }}>
              <react_1.Icon icon="ph:arrow-clockwise" className="h-5 w-5 me-1"/>
              {t("Restore")}
            </Button_1.default>)}
        </div>
      </div>
    </Message_1.default>);
};
exports.BulkSelectionMessage = BulkSelectionMessageBase;
