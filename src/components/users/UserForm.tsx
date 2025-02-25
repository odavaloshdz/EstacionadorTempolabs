import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { UserProfile, UserRole, ROLE_PERMISSIONS } from "@/types/auth";
import { 
  Shield, 
  Briefcase, 
  UserCircle, 
  Info, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Card, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: Partial<UserProfile>;
  isEditing?: boolean;
}

export interface UserFormData {
  email?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  password?: string;
}

// Role information for display
const roleInfo = {
  admin: {
    title: "Administrador",
    description: "Acceso completo a todas las funciones del sistema",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  manager: {
    title: "Gerente",
    description: "Puede gestionar tickets y ver reportes",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  employee: {
    title: "Empleado",
    description: "Puede gestionar tickets",
    icon: UserCircle,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
};

export default function UserForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<UserFormData>({
    defaultValues: {
      email: initialData?.email || "",
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      role: initialData?.role || "employee",
      is_active: initialData?.is_active ?? true,
      password: "",
    },
  });

  const selectedRole = watch("role");

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const RoleIcon = roleInfo[selectedRole].icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica la información del usuario y sus permisos" 
              : "Completa la información para crear un nuevo usuario en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Email
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>El email será usado para iniciar sesión</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="email"
              type="email"
              disabled={isEditing}
              placeholder="usuario@ejemplo.com"
              {...register("email", {
                required: !isEditing ? "El email es requerido" : false,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                placeholder="Nombre"
                {...register("first_name", { 
                  required: "El nombre es requerido" 
                })}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                placeholder="Apellido"
                {...register("last_name", { 
                  required: "El apellido es requerido" 
                })}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register("password", {
                  required: !isEditing ? "La contraseña es requerida" : false,
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={selectedRole}
              onValueChange={(value: UserRole) => setValue("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" className="flex items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-red-500" />
                    Administrador
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                    Gerente
                  </div>
                </SelectItem>
                <SelectItem value="employee">
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2 text-green-500" />
                    Empleado
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role information card */}
          <Card className={`${roleInfo[selectedRole].bgColor} border-0`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RoleIcon className={`h-8 w-8 ${roleInfo[selectedRole].color}`} />
                <div>
                  <h4 className="font-medium">{roleInfo[selectedRole].title}</h4>
                  <CardDescription>{roleInfo[selectedRole].description}</CardDescription>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ROLE_PERMISSIONS[selectedRole].map((permission) => (
                      <Badge key={permission} variant="outline" className="bg-white">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active" className="flex items-center gap-1">
              Usuario Activo
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Los usuarios inactivos no pueden iniciar sesión</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {isEditing ? "Guardando..." : "Creando..."}
                </>
              ) : (
                isEditing ? "Guardar Cambios" : "Crear Usuario"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
