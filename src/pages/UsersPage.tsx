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
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name || "",
          role: (roleData?.role || "employee") as UserRole,
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
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{
          user_id: authData.user?.id,
          role: data.role,
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
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({
          role: data.role,
        })
        .eq("user_id", selectedUser.id);

      if (roleError) {
        // If role doesn't exist, create it
        const { error: insertRoleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: selectedUser.id,
            role: data.role,
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={loadUsers}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Refrescar datos"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Usuarios</CardTitle>
            <CardDescription>Usuarios registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <UserCheck className="h-3 w-3 mr-1" /> {stats.active} Activos
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                <UserX className="h-3 w-3 mr-1" /> {stats.inactive} Inactivos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Distribución de Roles</CardTitle>
            <CardDescription>Usuarios por tipo de rol</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-red-500" />
                  <span>Administradores</span>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {stats.admins}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Gerentes</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {stats.managers}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <UserCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Empleados</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {stats.employees}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Filtros</CardTitle>
            <CardDescription>Buscar y filtrar usuarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
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
