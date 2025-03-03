import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";

export default function RegisterPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Regístrate para comenzar a gestionar tus estacionamientos"
      footerText="¿Ya tienes una cuenta?"
      footerLink={{
        text: "¿Ya tienes una cuenta?",
        href: "/login",
        label: "Inicia sesión",
      }}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
