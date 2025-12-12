"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileButton = void 0;
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const Avatar_1 = require("@/components/elements/base/avatar/Avatar");
const cn_1 = require("@/utils/cn");
const UserProfileButtonBase = ({ userName = "Clark Smith", userImageSrc = "/img/avatars/placeholder.webp", isVisible = false, }) => {
    const containerClasses = "flex h-16 shrink-0 items-center border-t border-primary-700 px-5";
    const linkClasses = "flex items-center gap-2 p-0.5";
    const imageContainerClasses = "mask mask-blob h-8 w-8 min-w-[1.6rem]";
    const imageClasses = "block w-full";
    const userNameClasses = (0, cn_1.cn)("whitespace-nowrap text-sm text-white transition-all duration-300 hover:text-white/70", {
        "opacity-100": isVisible,
        "opacity-0": !isVisible,
    });
    return (<div className={containerClasses}>
      <link_1.default href="/user/profile" className={linkClasses}>
        <span className={imageContainerClasses}>
          <MashImage_1.MashImage height={Avatar_1.sizes["xxs"]} width={Avatar_1.sizes["xxs"]} src={userImageSrc} className={imageClasses} alt=""/>
        </span>
        <span className={userNameClasses}>{userName}</span>
      </link_1.default>
    </div>);
};
exports.UserProfileButton = UserProfileButtonBase;
