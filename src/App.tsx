import { Suspense } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Home from "@/components/home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/pages/SettingsPage";
import routes from "tempo-routes";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <DashboardLayout>
          <Home />
        </DashboardLayout>
      }
    />
    <Route
      path="/dashboard/settings"
      element={
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      }
    />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Cargando...</p>}>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <AppRoutes />
      </Suspense>
    </AuthProvider>
  );
}
