"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const react_1 = __importDefault(require("react"));
const panel_1 = require("../../panel/panel");
const datatable_1 = require("@/stores/datatable");
const StructureRenderer_1 = __importDefault(require("./StructureRenderer"));
const ViewBase = ({ title }) => {
    const { panelAction, viewItem, isPanelOpen, closePanel, structureData } = (0, datatable_1.useDataTable)((state) => state);
    return (<panel_1.Panel isOpen={isPanelOpen} onClose={closePanel} side={panelAction === null || panelAction === void 0 ? void 0 : panelAction.side} size={panelAction === null || panelAction === void 0 ? void 0 : panelAction.modelSize} title={panelAction === null || panelAction === void 0 ? void 0 : panelAction.label} tableName={title}>
      <div className="pb-20">
        <StructureRenderer_1.default formValues={structureData.get} modalItem={viewItem}/>
      </div>
    </panel_1.Panel>);
};
exports.View = ViewBase;
