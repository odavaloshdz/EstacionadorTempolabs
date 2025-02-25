import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminTools() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { isAdmin } = usePermissions();
  const navigate = useNavigate();

  // Redirigir si no es administrador
  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setResult(null);
      
      // Paso 1: Obtener el ID del usuario desde la tabla de perfiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();
      
      if (profileError) {
        throw new Error(`Error al buscar el perfil: ${profileError.message}`);
      }
      
      if (!profileData) {
        throw new Error(`No se encontró ningún usuario con el email: ${email}`);
      }
      
      const userId = profileData.id;
      
      // Paso 2: Verificar si ya existe un registro en user_roles
      const { data: existingRole, error: roleCheckError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (roleCheckError && roleCheckError.code !== "PGRST116") {
        throw new Error(`Error al verificar el rol existente: ${roleCheckError.message}`);
      }
      
      // Paso 3: Actualizar o insertar el rol según corresponda
      if (existingRole) {
        const { error: updateError } = await supabase
          .from("user_roles")
          .update({ role: "admin" })
          .eq("user_id", userId);
        
        if (updateError) {
          throw new Error(`Error al actualizar el rol: ${updateError.message}`);
        }
      } else {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert([
            {
              user_id: userId,
              role: "admin",
              created_at: new Date().toISOString()
            }
          ]);
        
        if (insertError) {
          throw new Error(`Error al insertar el rol: ${insertError.message}`);
        }
      }
      
      setResult({ 
        success: true, 
        message: `El usuario ${email} ahora tiene rol de administrador.` 
      });
      
    } catch (error) {
      setResult({ 
        success: false, 
        message: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // No renderizar nada si no es admin (mientras redirige)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Herramientas Administrativas</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Gestión de Roles
            </CardTitle>
            <CardDescription>
              Asigna el rol de administrador a un usuario existente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico del usuario
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {result && (
                <Alert variant={result.success ? "default" : "destructive"}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {result.success ? "Éxito" : "Error"}
                  </AlertTitle>
                  <AlertDescription>
                    {result.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUpdateRole} 
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? "Procesando..." : "Asignar rol de administrador"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 