


interface userAttributes {
  id: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  phone?: string;
  roleId: number;
  profile?: string;
  lastLogin?: Date;
  lastFailedLogin?: Date | null;
  failedLoginAttempts?: number;
  walletAddress?: string;
  walletProvider?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  nftCount?: number; // Total NFTs created by the creator
  followersCount?: number; // Total followers count
  isFollowing?: boolean; // Whether the current user is following this creator
}

type userPk = "id";
type userId = user[userPk];
type userOptionalAttributes =
  | "id"
  | "email"
  | "password"
  | "avatar"
  | "firstName"
  | "lastName"
  | "emailVerified"
  | "phone"
  | "roleId"
  | "profile"
  | "lastLogin"
  | "lastFailedLogin"
  | "failedLoginAttempts"
  | "walletAddress"
  | "walletProvider"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type userCreationAttributes = Optional<
  userAttributes,
  userOptionalAttributes
>;
