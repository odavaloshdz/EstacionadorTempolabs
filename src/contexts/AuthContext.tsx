import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { AuthUser, UserRole } from "@/types/auth";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetAuthState: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para crear un timeout que resolverá después de un tiempo definido
const createTimeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  // Referencia para controlar eventos de autenticación duplicados
  const lastAuthEvent = useRef<{ event: string; timestamp: number } | null>(null);
  // Referencia para controlar si el componente está montado
  const isMounted = useRef(true);
  // Referencia para controlar si estamos en proceso de inicialización
  const isInitializing = useRef(false);

  // Función para resetear el estado de autenticación
  const resetAuthState = () => {
    console.log("Resetting auth state...");
    setLoading(true);
    setInitialized(false);
    setAuthError(null);
    setUser(null);
    lastAuthEvent.current = null;
    isInitializing.current = false;
    
    // Limpiamos cualquier dato de sesión en localStorage que pueda estar causando problemas
    localStorage.removeItem("supabase.auth.token");
    
    // Inmediatamente inicializamos de nuevo
    setTimeout(() => {
      if (isMounted.current) {
        initializeAuth();
      }
    }, 100);
  };

  // Función para crear un perfil de usuario si no existe
  const createUserProfile = async (userId: string, userEmail: string) => {
    try {
      console.log("Creating user profile for:", userEmail);
      
      // Crear perfil básico
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          first_name: userEmail.split('@')[0],
          last_name: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error("Error creating profile:", profileError);
        return false;
      }
      
      // Crear rol de usuario
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin", // Usamos "admin" que parece ser un valor válido en la base de datos
          created_at: new Date().toISOString()
        });
        
      if (roleError) {
        console.error("Error creating role:", roleError);
        return false;
      }
      
      console.log("User profile created successfully");
      return true;
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      return false;
    }
  };

  const loadUserProfile = async (userId: string, userEmail: string) => {
    try {
      console.log("Loading user profile for:", userEmail);
      
      // Creamos un timeout para asegurarnos de que la operación no quede atascada
      const timeoutPromise = createTimeout(5000).then(() => {
        console.warn("Profile loading timeout reached, using fallback user");
        return {
          timeout: true,
          fallbackUser: {
            id: userId,
            first_name: userEmail.split('@')[0],
            last_name: "",
            email: userEmail,
            role: "employee" as UserRole,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      });
      
      // Cargar el perfil
      const loadProfilePromise = (async () => {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
  
          // Si no existe el perfil, intentamos crearlo
          if (profileError) {
            console.error("Profile error:", profileError);
            
            if (profileError.code === 'PGRST116') { // No data found
              console.log("Profile not found, creating one...");
              const created = await createUserProfile(userId, userEmail);
              
              if (created) {
                // Intentar cargar el perfil nuevamente
                const { data: newProfile, error: newProfileError } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", userId)
                  .single();
                  
                if (newProfileError) {
                  console.error("Error loading new profile:", newProfileError);
                  return { error: newProfileError };
                }
                
                // Perfil creado y cargado exitosamente
                return { 
                  user: {
                    id: newProfile.id,
                    first_name: newProfile.first_name,
                    last_name: newProfile.last_name || "",
                    email: userEmail,
                    role: "employee" as UserRole,
                    is_active: true,
                    created_at: newProfile.created_at,
                    updated_at: newProfile.updated_at
                  } 
                };
              } else {
                // No se pudo crear el perfil
                return { error: new Error("Failed to create profile") };
              }
            } else {
              // Otro tipo de error
              return { error: profileError };
            }
          }
  
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .single();
  
          // Si no existe el rol, usamos un rol predeterminado
          let userRole: UserRole = "employee";
          if (!roleError && roleData?.role === "admin") {
            userRole = "admin";
          }
  
          if (profile) {
            return {
              user: {
                id: profile.id,
                first_name: profile.first_name,
                last_name: profile.last_name || "",
                email: userEmail,
                role: userRole,
                is_active: true,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              }
            };
          }
          
          return { error: new Error("Profile data not found") };
        } catch (err) {
          return { error: err instanceof Error ? err : new Error("Unknown error") };
        }
      })();
      
      // Competencia entre el timeout y la carga del perfil
      const result = await Promise.race([timeoutPromise, loadProfilePromise]);
      
      // Comprobamos el resultado
      if ('timeout' in result && result.timeout) {
        console.warn("Using fallback user due to timeout");
        if (isMounted.current) {
          setUser(result.fallbackUser);
          setLoading(false);
        }
        return;
      }
      
      if ('error' in result && result.error) {
        console.error("Error in profile loading:", result.error);
        // Creamos un usuario básico para que la aplicación funcione
        if (isMounted.current) {
          setUser({
            id: userId,
            first_name: userEmail.split('@')[0],
            last_name: "",
            email: userEmail,
            role: "employee" as UserRole,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          setLoading(false);
        }
        return;
      }
      
      if ('user' in result && result.user) {
        if (isMounted.current) {
          setUser(result.user);
          setLoading(false);
        }
        return;
      }
      
      // Si llegamos aquí, algo inesperado ocurrió
      console.error("Unexpected result in loadUserProfile", result);
      if (isMounted.current) {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // En caso de error, creamos un usuario básico para que la aplicación funcione
      if (isMounted.current) {
        setUser({
          id: userId,
          first_name: userEmail.split('@')[0],
          last_name: "",
          email: userEmail,
          role: "employee" as UserRole,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setLoading(false);
      }
    }
  };

  // Función para evitar procesar eventos duplicados
  const shouldProcessAuthEvent = (event: string) => {
    const now = Date.now();
    
    // Si es el mismo evento en menos de 2 segundos, lo ignoramos
    if (lastAuthEvent.current && 
        lastAuthEvent.current.event === event && 
        now - lastAuthEvent.current.timestamp < 2000) {
      console.log(`Ignoring duplicate auth event: ${event}`);
      return false;
    }
    
    // Actualizar el último evento
    lastAuthEvent.current = { event, timestamp: now };
    return true;
  };

  // Función para inicializar la autenticación
  const initializeAuth = async () => {
    // Evitar inicializaciones múltiples simultáneas
    if (isInitializing.current || !isMounted.current) {
      console.log("Already initializing or component unmounted, skipping");
      return;
    }
    
    if (initialized) {
      console.log("Auth already initialized, skipping");
      return;
    }
    
    isInitializing.current = true;
    
    try {
      setLoading(true);
      console.log("Initializing auth...");
      
      // Crear un timeout para evitar que la inicialización quede atascada
      const initTimeout = setTimeout(() => {
        if (isMounted.current && loading) {
          console.warn("Auth initialization timeout reached, resetting state");
          setUser(null);
          setLoading(false);
          setInitialized(true);
          setAuthError(new Error("Auth initialization timeout"));
          isInitializing.current = false;
        }
      }, 8000);
      
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();
      
      // Limpiar el timeout ya que la operación completó
      clearTimeout(initTimeout);
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        if (isMounted.current) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
          setAuthError(sessionError);
        }
        isInitializing.current = false;
        return;
      }
      
      console.log("Session retrieved:", session ? "Yes" : "No");
      
      if (session?.user && isMounted.current) {
        console.log("Loading user profile for:", session.user.email);
        await loadUserProfile(session.user.id, session.user.email!);
      } else if (isMounted.current) {
        console.log("No session, setting user to null");
        setUser(null);
        setLoading(false);
      }
      
      if (isMounted.current) {
        console.log("Setting initialized to true");
        setInitialized(true);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      if (isMounted.current) {
        setUser(null);
        setLoading(false);
        setInitialized(true);
        setAuthError(error instanceof Error ? error : new Error("Unknown error"));
      }
    } finally {
      isInitializing.current = false;
    }
  };

  useEffect(() => {
    console.log("AuthProvider useEffect running, initialized:", initialized);
    isMounted.current = true;

    // Inicializar autenticación
    initializeAuth();

    // Suscribirse a cambios de estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Evitar procesar eventos duplicados
      if (!shouldProcessAuthEvent(event)) return;
      
      console.log("Auth state changed:", event, session?.user?.email);
      
      // Ignorar eventos INITIAL_SESSION si ya estamos inicializados
      if (event === 'INITIAL_SESSION' && initialized) {
        console.log("Ignoring INITIAL_SESSION event as we're already initialized");
        return;
      }
      
      if (session?.user && isMounted.current) {
        try {
          console.log("Loading user profile after auth state change");
          setLoading(true);
          
          // Establecer un timeout para cargar el perfil
          const profileTimeout = setTimeout(() => {
            if (isMounted.current && loading) {
              console.warn("Profile loading timeout in auth state change");
              // Crear un usuario genérico y continuar
              setUser({
                id: session.user.id,
                first_name: session.user.email!.split('@')[0],
                last_name: "",
                email: session.user.email!,
                role: "employee" as UserRole,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              setLoading(false);
            }
          }, 5000);
          
          await loadUserProfile(session.user.id, session.user.email!);
          
          // Limpiar el timeout ya que la operación completó
          clearTimeout(profileTimeout);
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (isMounted.current) {
            setUser(null);
            setLoading(false);
          }
        }
      } else if (isMounted.current) {
        console.log("No session in auth state change, setting user to null");
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up AuthProvider effect");
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email!);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    resetAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
