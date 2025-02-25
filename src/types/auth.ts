export type UserRole = "admin" | "manager" | "employee";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  role: UserRole | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends UserProfile {
  email: string;
}

export type Permission =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "settings.view"
  | "settings.edit"
  | "reports.view"
  | "tickets.manage";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "settings.view",
    "settings.edit",
    "reports.view",
    "tickets.manage",
  ],
  manager: [
    "users.view",
    "settings.view",
    "reports.view",
    "tickets.manage",
  ],
  employee: [
    "settings.view",
    "tickets.manage",
  ],
};
