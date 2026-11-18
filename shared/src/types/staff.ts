import type { UserPositionType, UserRoleType } from "./user.js";

export interface Staff {
  id: string;
  userId: string;
  shopId: string;
  position: UserPositionType;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    avatarUrl: string | null;
    role: UserRoleType;
  };
}