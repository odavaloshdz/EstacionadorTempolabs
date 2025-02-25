import { Suspense, useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Home from "@/components/home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/pages/SettingsPage";
import UsersPage from "@/pages/UsersPage";
import AdminTools from "@/pages/AdminTools";
import SessionRecovery from "@/components/SessionRecovery";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, resetAuthState } = useAuth();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [showRecoveryOption, setShowRecoveryOption] = useState(false);
  const loadingTimerRef = useRef<number | null>(null);
  const recoveryTimerRef = useRef<number | null>(null);
  const attemptCountRef = useRef(0);

  useEffect(() => {
    console.log("PrivateRoute effect - loading:", loading, "user:", user ? "exists" : "null");
    
    // Limpiar timers existentes
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    
    if (recoveryTimerRef.current) {
      clearTimeout(recoveryTimerRef.current);
      recoveryTimerRef.current = null;
    }

    // Si está cargando, configuramos timers para mostrar mensajes
    if (loading) {
      attemptCountRef.current += 1;
      setShowLoading(false);
      setShowRecoveryOption(false);
      
      // Después de 3 segundos, mostrar mensaje de carga
      loadingTimerRef.current = window.setTimeout(() => {
        if (loading) {
          setShowLoading(true);
        }
      }, 3000);
      
      // Después de 10 segundos, mostrar opción de recuperación
      recoveryTimerRef.current = window.setTimeout(() => {
        if (loading) {
          setShowRecoveryOption(true);
          
          // Si han pasado más de 3 intentos, intentar resetear el estado de autenticación
          if (attemptCountRef.current > 3) {
            console.log("Too many loading attempts, resetting auth state");
            resetAuthState();
            attemptCountRef.current = 0;
          }
        }
      }, 10000);
    } else {
      setShowLoading(false);
      setShowRecoveryOption(false);
    }

    return () => {
      // Limpiar timers al desmontar
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (recoveryTimerRef.current) {
        clearTimeout(recoveryTimerRef.current);
      }
    };
  }, [loading, user, navigate, resetAuthState]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 max-w-md">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          {showLoading && (
            <div className="mt-4">
              <p className="text-gray-600 mb-4">
                Cargando la aplicación...
              </p>
              {showRecoveryOption && (
                <div className="mt-4">
                  <p className="text-amber-600 mb-2">
                    Está tomando más tiempo de lo esperado.
                  </p>
                  <button
                    onClick={() => navigate('/recovery')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Ir a recuperación de sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

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
    <Route
      path="/dashboard/admin-tools"
      element={
        <PrivateRoute>
          <DashboardLayout>
            <AdminTools />
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
