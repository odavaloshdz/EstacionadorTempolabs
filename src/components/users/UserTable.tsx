import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { 
  Edit, 
  Trash2, 
  UserPlus, 
  Shield, 
  Briefcase, 
  UserCircle,
  MoreHorizontal,
  Mail,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserTableProps {
  users: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
  onCreateNew: () => void;
  onMakeAdmin?: (user: UserProfile) => void;
}

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onCreateNew,
  onMakeAdmin,
}: UserTableProps) {
  const { hasPermission, isAdmin } = usePermissions();
  const canEdit = hasPermission("users.edit");
  const canDelete = hasPermission("users.delete");
  const canCreate = hasPermission("users.create");

  // Helper function to get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "manager":
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case "employee":
        return <UserCircle className="h-4 w-4 text-green-500" />;
      default:
        return <UserCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Helper function to get role text
  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "employee":
        return "Empleado";
      default:
        return "Desconocido";
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Usuarios</h2>
        {canCreate && (
          <Button onClick={onCreateNew} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay usuarios para mostrar
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email || "Sin email"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "destructive"
                          : user.role === "manager"
                          ? "outline"
                          : "default"
                      }
                      className={
                        user.role === "manager"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : user.role === "employee"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }
                    >
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role || "employee")}
                        <span>{getRoleText(user.role || "employee")}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                            <span>{formatDate(user.created_at)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fecha de registro: {format(new Date(user.created_at), "PPP", { locale: es })}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {isAdmin && onMakeAdmin && user.role !== "admin" && (
                          <DropdownMenuItem onClick={() => onMakeAdmin(user)}>
                            <Shield className="h-4 w-4 mr-2 text-red-500" />
                            Hacer Administrador
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(user)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t text-sm text-gray-500">
        Mostrando {users.length} {users.length === 1 ? "usuario" : "usuarios"}
      </div>
    </div>
  );
}
