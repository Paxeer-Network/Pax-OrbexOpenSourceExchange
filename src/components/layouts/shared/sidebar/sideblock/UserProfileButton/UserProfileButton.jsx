"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileButton = void 0;
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const Avatar_1 = require("@/components/elements/base/avatar/Avatar");
const next_i18next_1 = require("next-i18next");
const UserProfileButtonBase = ({ userName = "Clark C.", userImageSrc = "/img/avatars/placeholder.webp", }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mb-2 flex items-center">
      <link_1.default href="/user/profile" className="flex h-[68px] items-center gap-2 px-6">
        <span className="mask mask-blob h-12 w-12 shrink-0">
          <MashImage_1.MashImage height={Avatar_1.sizes["xs"]} width={Avatar_1.sizes["xs"]} src={userImageSrc} className="block w-full" alt={userName}/>
        </span>

        <div>
          <span className="block font-sans text-xs uppercase leading-tight text-muted-400">
            {t("Welcome")}
          </span>
          <span className="block font-sans text-base font-normal leading-tight text-muted-800 dark:text-muted-100">
            {userName}
          </span>
        </div>
      </link_1.default>
    </div>);
};
exports.UserProfileButton = UserProfileButtonBase;
