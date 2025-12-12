"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const AvatarGroup = ({ avatars, limit = 4, size = "xs", }) => {
    return (<div className="flex items-center">
      {avatars.slice(0, limit).map((avatar, index) => {
            var _a;
            return (<Avatar_1.default key={index} overlaps size={size} src={avatar.src} alt={(_a = avatar.alt) !== null && _a !== void 0 ? _a : "avatar image"}/>);
        })}

      {avatars.length > limit && (<Avatar_1.default overlaps size={size} text={`+${avatars.length - limit}`}/>)}
    </div>);
};
exports.default = AvatarGroup;
