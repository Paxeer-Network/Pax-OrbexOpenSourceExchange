"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavActions = void 0;
const datatable_1 = require("@/stores/datatable");
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const IconButton_1 = __importDefault(require("../../button-icon/IconButton"));
const react_1 = require("@iconify/react");
const Tooltip_1 = require("../../tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const NavActionsBase = ({ navAction, navActionsSlot }) => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { actionConfigs, navActionsState, handleAction } = (0, datatable_1.useDataTable)((state) => state);
    const renderActions = (actions) => actions === null || actions === void 0 ? void 0 : actions.map((action, index) => (<div key={index}>
        {action.type === "checkbox" ? (<ToggleSwitch_1.default label={t(action.label)} color={action.color} sublabel={t(action.sublabel)} checked={navActionsState[action.topic]} onChange={() => handleAction(action)}/>) : (<Tooltip_1.Tooltip content={t(action.label)}>
            <IconButton_1.default variant="pastel" aria-label={t(action.label)} onClick={() => handleAction(action)} color={action.color || "primary"} size="lg" shape={"rounded"}>
              <react_1.Icon icon={action.icon} className="h-6 w-6"/>
            </IconButton_1.default>
          </Tooltip_1.Tooltip>)}
      </div>));
    return (<>
      {navAction
            ? renderActions([navAction])
            : (navActionsSlot || ((_a = actionConfigs === null || actionConfigs === void 0 ? void 0 : actionConfigs.navActionsConfig) === null || _a === void 0 ? void 0 : _a.length) > 0) && (<div className="flex items-start justify-between sm:justify-end w-full sm:w-auto gap-3">
              <div className="flex items-start justify-between w-full gap-5">
                {navActionsSlot}
                {renderActions(actionConfigs === null || actionConfigs === void 0 ? void 0 : actionConfigs.navActionsConfig)}
              </div>
            </div>)}
    </>);
};
exports.NavActions = NavActionsBase;
