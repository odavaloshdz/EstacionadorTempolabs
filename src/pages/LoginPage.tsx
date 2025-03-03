import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";

export default function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta para gestionar tus estacionamientos"
      footerText="¿No tienes una cuenta?"
      footerLink={{
        text: "¿No tienes una cuenta?",
        href: "/register",
        label: "Regístrate ahora",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}
