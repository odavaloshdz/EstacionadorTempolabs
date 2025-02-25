import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UserTable from "@/components/users/UserTable";
import UserForm, { UserFormData } from "@/components/users/UserForm";
import { UserProfile, UserRole } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { usePermissions } from "@/hooks/usePermissions";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const { hasPermission } = usePermissions();

  const loadUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get users from auth.users table
      const { data: authData, error: authError } =
        await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Combine profile and auth data
      const usersWithEmail = (profiles || []).map((profile) => {
        const authUser = authData.users.find((u: any) => u.id === profile.id);
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          role: (profile.role || "employee") as UserRole,
          is_active: profile.is_active,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          email: authUser?.email,
        };
      });

      setUsers(usersWithEmail);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission("users.view")) {
      loadUsers();
    }
  }, []);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: data.email!,
          password: data.password!,
          email_confirm: true,
        });

      if (authError) throw authError;

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: authData.user.id,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            is_active: data.is_active,
          },
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          is_active: data.is_active,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast({
        title: "Usuario actualizado",
        description: "Los cambios han sido guardados exitosamente",
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  if (!hasPermission("users.view")) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          No tienes permisos para ver esta página
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <UserTable
        users={users}
        onEdit={(user) => {
          setSelectedUser(user);
          setShowForm(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setShowDeleteDialog(true);
        }}
        onCreateNew={() => {
          setSelectedUser(null);
          setShowForm(true);
        }}
      />

      {showForm && (
        <UserForm
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          initialData={selectedUser || undefined}
          isEditing={!!selectedUser}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario
              {selectedUser &&
                ` ${selectedUser.first_name} ${selectedUser.last_name}`}
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
