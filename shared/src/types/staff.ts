export interface Staff {
  id: string;
  role?: StaffRole;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export type StaffRole = "OWNER" | "MANAGER" | "STAFF";