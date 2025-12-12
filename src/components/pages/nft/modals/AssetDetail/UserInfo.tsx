import React from "react";

interface UserInfoProps {
  label: string;
  user: any;
}

const UserInfo: React.FC<UserInfoProps> = ({ label, user }) => {
  return (
    <div className="flex items-center space-x-3">
      <img
        src={user.avatar || "/img/avatars/placeholder.webp"}
        alt={user.firstName}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-medium text-muted">{label}</h2>
        <span className="font-medium text-muted-900 dark:text-white">
          @{user.firstName}
        </span>
      </div>
    </div>
  );
};

export default UserInfo;
