import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SessionRecovery = () => {
  const navigate = useNavigate();
  const { resetAuthState } = useAuth();
  const [sessionStatus, setSessionStatus] = useState<'checking' | 'exists' | 'none'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("SessionRecovery: Checking session status");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("SessionRecovery: Error checking session", error);
          setError(error.message);
          setSessionStatus('none');
          return;
        }
        
        if (data.session) {
          console.log("SessionRecovery: Session exists", data.session.user?.email);
          setSessionStatus('exists');
        } else {
          console.log("SessionRecovery: No session found");
          setSessionStatus('none');
        }
      } catch (e) {
        console.error("SessionRecovery: Unexpected error", e);
        setError(e instanceof Error ? e.message : 'Unknown error');
        setSessionStatus('none');
      }
    };
    
    checkSession();
  }, []);

  const handleRedirectToLogin = () => {
    navigate('/login');
  };

  const handleRetryDashboard = () => {
    navigate('/dashboard');
  };

  const handleResetAuthAndRetry = () => {
    console.log("Resetting auth state and retrying...");
    resetAuthState();
    // Damos tiempo para que el estado se reinicie
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear(); // Limpieza completa de localStorage
      sessionStorage.clear(); // Limpieza de sessionStorage
      
      // Forzar recarga completa de la página
      window.location.href = '/login';
    } catch (e) {
      console.error("Error signing out:", e);
      // Si falla el logout, intentamos redireccionar directamente
      navigate('/login');
    }
  };

  if (sessionStatus === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <div className="text-lg font-medium">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Recuperación de Sesión</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="mb-2">Estado de la sesión: 
            <span className={`font-medium ${sessionStatus === 'exists' ? 'text-green-600' : 'text-red-600'}`}>
              {sessionStatus === 'exists' ? ' Activa' : ' No activa'}
            </span>
          </p>
          
          <p className="text-gray-700 text-sm mb-4">
            {sessionStatus === 'exists' 
              ? "Tu sesión existe pero hay un problema al cargar el dashboard. Puedes intentar reiniciar la sesión o ir al dashboard."
              : "No tienes una sesión activa. Necesitas iniciar sesión para continuar."}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          {sessionStatus === 'exists' && (
            <>
              <Button 
                onClick={handleResetAuthAndRetry}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Reiniciar sesión y reintentar
              </Button>
              
              <Button 
                onClick={handleRetryDashboard}
                className="w-full"
              >
                Reintentar Dashboard
              </Button>
            </>
          )}
          
          <Button 
            onClick={handleRedirectToLogin}
            variant="outline"
            className="w-full"
          >
            Ir a Login
          </Button>
          
          <Button 
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            Cerrar Sesión y Limpiar Datos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionRecovery; 