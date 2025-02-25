import { useAuth } from "@/contexts/AuthContext";
import { Permission, ROLE_PERMISSIONS } from "@/types/auth";

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  return {
    hasPermission,
    isAdmin: user?.role === "admin",
  };
}
