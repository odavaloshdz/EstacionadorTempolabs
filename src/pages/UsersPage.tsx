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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  RefreshCw,
  Shield,
  Briefcase,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    managers: 0,
    employees: 0
  });
  const { toast } = useToast();
  const { hasPermission } = usePermissions();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get roles from user_roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine profile and roles data
      const usersWithRoles = (profiles || []).map((profile: any) => {
        const roleData = rolesData?.find((r) => r.user_id === profile.id);
        // Map database roles to application roles
        let appRole: UserRole = "employee";
        if (roleData?.role === "admin") {
          appRole = "admin";
        } else if (roleData?.role === "user") {
          // Determine if this is a manager or employee based on permissions or other criteria
          // For now, we'll default to employee
          appRole = "employee";
        }
        
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name || "",
          role: appRole,
          is_active: true, // Assuming all users are active by default
          created_at: profile.created_at,
          updated_at: profile.updated_at || profile.created_at,
          email: profile.email || "",
        };
      });

      setUsers(usersWithRoles);
      updateStats(usersWithRoles);
      applyFilters(usersWithRoles, searchQuery, roleFilter);
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

  const updateStats = (userList: UserProfile[]) => {
    const activeUsers = userList.filter(u => u.is_active);
    const inactiveUsers = userList.filter(u => !u.is_active);
    const adminUsers = userList.filter(u => u.role === "admin");
    const managerUsers = userList.filter(u => u.role === "manager");
    const employeeUsers = userList.filter(u => u.role === "employee");

    setStats({
      total: userList.length,
      active: activeUsers.length,
      inactive: inactiveUsers.length,
      admins: adminUsers.length,
      managers: managerUsers.length,
      employees: employeeUsers.length
    });
  };

  const applyFilters = (userList: UserProfile[], query: string, role: string) => {
    let filtered = [...userList];
    
    // Apply search query filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.first_name?.toLowerCase().includes(lowerQuery) || 
          user.last_name?.toLowerCase().includes(lowerQuery) || 
          user.email?.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply role filter
    if (role !== "all") {
      filtered = filtered.filter(user => user.role === role);
    }
    
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (hasPermission("users.view")) {
      loadUsers();
    }
  }, []);

  useEffect(() => {
    applyFilters(users, searchQuery, roleFilter);
  }, [searchQuery, roleFilter, users]);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email!,
        password: data.password!,
      });

      if (authError) throw authError;

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user?.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      // 3. Assign role
      // Map application roles to database roles
      const dbRole = data.role === "admin" ? "admin" : "user";
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{
          user_id: authData.user?.id,
          role: dbRole,
          created_at: new Date().toISOString(),
        }]);

      if (roleError) throw roleError;

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
      // 1. Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedUser.id);

      if (profileError) throw profileError;

      // 2. Update role
      // Map application roles to database roles
      const dbRole = data.role === "admin" ? "admin" : "user";
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({
          role: dbRole,
        })
        .eq("user_id", selectedUser.id);

      if (roleError) {
        // If role doesn't exist, create it
        const { error: insertRoleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: selectedUser.id,
            role: dbRole,
            created_at: new Date().toISOString(),
          }]);

        if (insertRoleError) throw insertRoleError;
      }

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
      // 1. Delete user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id);

      if (roleError) console.error("Error deleting user role:", roleError);

      // 2. Delete user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedUser.id);

      if (profileError) console.error("Error deleting user profile:", profileError);

      // 3. Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUser.id
      );

      if (authError) throw authError;

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

  const handleMakeAdmin = async (user: UserProfile) => {
    try {
      setLoading(true);
      
      // Verificar si el usuario ya tiene un rol asignado
      const { data: existingRole, error: roleCheckError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (roleCheckError && roleCheckError.code !== "PGRST116") {
        throw roleCheckError;
      }
      
      // Actualizar o insertar el rol según corresponda
      if (existingRole) {
        const { error: updateError } = await supabase
          .from("user_roles")
          .update({ role: "admin" })
          .eq("user_id", user.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert([
            {
              user_id: user.id,
              role: "admin",
              created_at: new Date().toISOString()
            }
          ]);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Rol actualizado",
        description: `${user.first_name} ${user.last_name} ahora es administrador`,
      });
      
      await loadUsers();
    } catch (error: any) {
      console.error("Error al asignar rol de administrador:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el rol de administrador",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-gray-500">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      
      {/* Estadísticas y filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">
              <span className="text-green-500">{stats.active} activos</span>
              {stats.inactive > 0 && (
                <span className="text-red-500 ml-2">{stats.inactive} inactivos</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800">
                {stats.admins} Administradores
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {stats.managers} Gerentes
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {stats.employees} Empleados
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por nombre o email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => loadUsers()}
                title="Recargar"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="manager">Gerentes</SelectItem>
                <SelectItem value="employee">Empleados</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabla de usuarios */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
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
          onMakeAdmin={handleMakeAdmin}
        />
      )}

      {/* Formulario de usuario */}
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

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario {selectedUser?.first_name} {selectedUser?.last_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
