import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Home from "@/components/home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/pages/SettingsPage";
import UsersPage from "@/pages/UsersPage";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
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
