import { Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Home from "@/components/home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/pages/SettingsPage";
import UsersPage from "@/pages/UsersPage";
import SessionRecovery from "@/components/SessionRecovery";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [longLoadingTimeout, setLongLoadingTimeout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PrivateRoute effect - loading:", loading, "user:", user ? "exists" : "null");
    
    // Si el estado de carga dura más de 3 segundos, mostramos un mensaje más informativo
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached (3s)");
        setLoadingTimeout(true);
      }
    }, 3000);
    
    // Si el estado de carga dura más de 10 segundos, redirigimos a la página de recuperación
    const longTimer = setTimeout(() => {
      if (loading) {
        console.log("Long loading timeout reached (10s)");
        setLongLoadingTimeout(true);
        // Redirigir a la página de recuperación de sesión después de 10 segundos
        navigate("/recovery", { replace: true });
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(longTimer);
    };
  }, [loading, user, navigate]);

  // Verificar la sesión directamente como respaldo
  useEffect(() => {
    if (loading && loadingTimeout) {
      console.log("Checking session directly as backup");
      const checkSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          console.log("Direct session check:", data.session ? "session exists" : "no session", error);
          
          if (error || !data.session) {
            console.log("No valid session found, redirecting to login");
            navigate("/login", { replace: true });
          }
        } catch (e) {
          console.error("Error checking session:", e);
        }
      };
      
      checkSession();
    }
  }, [loadingTimeout, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <div className="text-lg font-medium">Cargando...</div>
        {loadingTimeout && (
          <div className="mt-4 text-sm text-gray-500 max-w-md text-center">
            Esto está tomando más tiempo de lo esperado. 
            <button 
              onClick={() => navigate("/recovery")}
              className="ml-2 text-primary underline"
            >
              Ir a recuperación
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/recovery" element={<SessionRecovery />} />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/dashboard/settings"
      element={
        <PrivateRoute>
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/dashboard/users"
      element={
        <PrivateRoute>
          <DashboardLayout>
            <UsersPage />
          </DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Cargando...</div>}>
        <AppRoutes />
      </Suspense>
    </AuthProvider>
  );
}
