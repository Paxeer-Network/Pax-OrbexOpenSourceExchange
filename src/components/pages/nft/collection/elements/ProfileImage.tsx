import React from "react";

const ProfileImage = ({ avatar }) => (
  <div className="absolute left-6 md:left-12 -bottom-16 w-32 h-32 rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
    <img
      src={avatar || "/img/avatars/placeholder.webp"}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  </div>
);

export default ProfileImage;
