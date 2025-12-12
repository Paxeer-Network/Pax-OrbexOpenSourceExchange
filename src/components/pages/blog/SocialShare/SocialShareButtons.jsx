"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_share_1 = require("react-share");
const react_2 = require("@iconify/react");
const SocialShareButtons = ({ url }) => {
    return (<div className="flex gap-3">
      {/* Facebook */}
      <react_share_1.FacebookShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition duration-200">
          <react_2.Icon icon={"akar-icons:facebook-fill"} className="text-white w-5 h-5"/>
        </div>
      </react_share_1.FacebookShareButton>

      {/* Twitter */}
      <react_share_1.TwitterShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full cursor-pointer hover:bg-blue-500 transition duration-200">
          <react_2.Icon icon={"akar-icons:twitter-fill"} className="text-white w-5 h-5"/>
        </div>
      </react_share_1.TwitterShareButton>

      {/* LinkedIn */}
      <react_share_1.LinkedinShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full cursor-pointer hover:bg-blue-800 transition duration-200">
          <react_2.Icon icon={"akar-icons:linkedin-fill"} className="text-white w-5 h-5"/>
        </div>
      </react_share_1.LinkedinShareButton>

      {/* WhatsApp */}
      <react_share_1.WhatsappShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-green-400 rounded-full cursor-pointer hover:bg-green-500 transition duration-200">
          <react_2.Icon icon={"akar-icons:whatsapp-fill"} className="text-white w-5 h-5"/>
        </div>
      </react_share_1.WhatsappShareButton>

      {/* Email */}
      <a href={`mailto:?subject=Check out this post&body=${url}`} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-900 transition duration-200">
          <react_2.Icon icon={"mdi:email"} className="text-white w-5 h-5"/>
        </div>
      </a>
    </div>);
};
exports.default = SocialShareButtons;
