"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const next_i18next_1 = require("next-i18next");
const ListWidgetItem = ({ href, title, text, avatar, itemAction, avatarSize = "xs", className: classes = "", }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className={`flex justify-between py-3 ${classes}`}>
      <div className="flex w-full items-center gap-2">
        {typeof avatar === "string" ? (<Avatar_1.default size={avatarSize} src={avatar} alt={`${title} photo`}/>) : (avatar)}
        <div className="h-max max-w-[230px] font-sans">
          <span className="item-title block text-sm font-medium text-muted-800 dark:text-muted-100">
            {title}
          </span>
          <span className="block text-xs text-muted-400">{text}</span>
        </div>
        <div className="ms-auto flex items-center justify-end ">
          {itemAction ? (itemAction) : (<ButtonLink_1.default href={href} size="sm">
              {t("View")}
            </ButtonLink_1.default>)}
        </div>
      </div>
    </div>);
};
exports.default = ListWidgetItem;
