import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { Icon } from "@iconify/react";

const SocialShareButtons = ({ url }: { url: string }) => {
  return (
    <div className="flex gap-3">
      {/* Facebook */}
      <FacebookShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition duration-200">
          <Icon
            icon={"akar-icons:facebook-fill"}
            className="text-white w-5 h-5"
          />
        </div>
      </FacebookShareButton>

      {/* Twitter */}
      <TwitterShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full cursor-pointer hover:bg-blue-500 transition duration-200">
          <Icon
            icon={"akar-icons:twitter-fill"}
            className="text-white w-5 h-5"
          />
        </div>
      </TwitterShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full cursor-pointer hover:bg-blue-800 transition duration-200">
          <Icon
            icon={"akar-icons:linkedin-fill"}
            className="text-white w-5 h-5"
          />
        </div>
      </LinkedinShareButton>

      {/* WhatsApp */}
      <WhatsappShareButton url={url}>
        <div className="flex items-center justify-center w-8 h-8 bg-green-400 rounded-full cursor-pointer hover:bg-green-500 transition duration-200">
          <Icon
            icon={"akar-icons:whatsapp-fill"}
            className="text-white w-5 h-5"
          />
        </div>
      </WhatsappShareButton>

      {/* Email */}
      <a
        href={`mailto:?subject=Check out this post&body=${url}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-900 transition duration-200">
          <Icon icon={"mdi:email"} className="text-white w-5 h-5" />
        </div>
      </a>
    </div>
  );
};

export default SocialShareButtons;
