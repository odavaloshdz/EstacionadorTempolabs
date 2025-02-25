import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, UserPlus } from "lucide-react";
import { UserProfile } from "@/types/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserTableProps {
  users: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
  onCreateNew: () => void;
}

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onCreateNew,
}: UserTableProps) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("users.edit");
  const canDelete = hasPermission("users.delete");
  const canCreate = hasPermission("users.create");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios del Sistema</h2>
        {canCreate && (
          <Button onClick={onCreateNew}>
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? "Administrador" : "Empleado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "destructive"}>
                    {user.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), "PPP", { locale: es })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
