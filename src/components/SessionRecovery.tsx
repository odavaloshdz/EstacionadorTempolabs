import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const SessionRecovery = () => {
  const navigate = useNavigate();
  const { resetAuthState } = useAuth();
  const [sessionStatus, setSessionStatus] = useState<"checking" | "exists" | "none">("checking");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setError("No se pudo verificar la sesión: " + error.message);
          setSessionStatus("none");
          return;
        }
        
        if (data.session) {
          console.log("Session exists:", data.session.user.email);
          setSessionStatus("exists");
        } else {
          console.log("No session found");
          setSessionStatus("none");
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        setError("Error inesperado al verificar la sesión");
        setSessionStatus("none");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        setError("Error al cerrar sesión: " + error.message);
        return;
      }
      
      // Limpiar localStorage para eliminar cualquier dato de sesión persistente
      localStorage.clear();
      
      // Redirigir al login
      navigate("/login");
    } catch (err) {
      console.error("Unexpected error signing out:", err);
      setError("Error inesperado al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAuthAndRetry = () => {
    resetAuthState();
    // Esperar un momento antes de redirigir para que el estado se reinicie
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperación de Sesión</h1>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                {sessionStatus === "checking" && "Verificando estado de la sesión..."}
                {sessionStatus === "exists" && "Hemos detectado que tienes una sesión activa, pero la aplicación no está cargando correctamente."}
                {sessionStatus === "none" && "No se ha detectado una sesión activa. Debes iniciar sesión nuevamente."}
              </p>
              
              {sessionStatus === "exists" && (
                <p className="text-gray-600 mb-4">
                  Puedes intentar acceder al dashboard nuevamente, reiniciar la sesión o cerrar sesión y volver a iniciarla.
                </p>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              {sessionStatus === "exists" && (
                <>
                  <button
                    onClick={handleGoToDashboard}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
                  >
                    Intentar acceder al dashboard
                  </button>
                  
                  <button
                    onClick={handleResetAuthAndRetry}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition"
                  >
                    Reiniciar sesión y reintentar
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                  >
                    Cerrar sesión y limpiar datos
                  </button>
                </>
              )}
              
              {sessionStatus === "none" && (
                <button
                  onClick={handleGoToLogin}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
                >
                  Ir a la página de inicio de sesión
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionRecovery; 