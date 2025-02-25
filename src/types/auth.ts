export type UserRole = "admin" | "employee";

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
  | "settings.edit";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "settings.view",
    "settings.edit",
  ],
  employee: ["settings.view"],
};
