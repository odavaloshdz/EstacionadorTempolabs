import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AuthUser, UserRole } from "@/types/auth";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

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
              setUser(null);
              setLoading(false);
              return;
            }
            
            // Perfil creado y cargado exitosamente
            setUser({
              id: newProfile.id,
              first_name: newProfile.first_name,
              last_name: newProfile.last_name || "",
              email: userEmail,
              role: "employee" as UserRole,
              is_active: true,
              created_at: newProfile.created_at,
              updated_at: newProfile.updated_at
            });
            setLoading(false);
            return;
          } else {
            // No se pudo crear el perfil
            setUser(null);
            setLoading(false);
            return;
          }
        } else {
          // Otro tipo de error
          setUser(null);
          setLoading(false);
          return;
        }
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      // Si no existe el rol, usamos un rol predeterminado
      if (roleError) {
        console.error("Role error:", roleError);
        console.log("Using default role: employee");
        
        if (profile) {
          setUser({
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name || "",
            email: userEmail,
            role: "employee" as UserRole,
            is_active: true,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          });
        }
        setLoading(false);
        return;
      }

      if (profile) {
        // Verificar que el rol sea válido según UserRole
        let userRole: UserRole = "employee";
        if (roleData?.role === "admin") {
          userRole = "admin";
        }
        
        setUser({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name || "",
          email: userEmail,
          role: userRole,
          is_active: true,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading user profile:", error);
      // En caso de error, creamos un usuario básico para que la aplicación funcione
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
  };

  useEffect(() => {
    console.log("AuthProvider useEffect running, initialized:", initialized);
    let mounted = true;

    const initializeAuth = async () => {
      if (initialized) return;
      try {
        setLoading(true);
        console.log("Initializing auth...");
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setUser(null);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
        
        console.log("Session retrieved:", session ? "Yes" : "No");
        
        if (session?.user && mounted) {
          console.log("Loading user profile for:", session.user.email);
          await loadUserProfile(session.user.id, session.user.email!);
        } else if (mounted) {
          console.log("No session, setting user to null");
          setUser(null);
          setLoading(false);
        }
        
        if (mounted) {
          console.log("Setting initialized to true");
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      if (session?.user && mounted) {
        try {
          console.log("Loading user profile after auth state change");
          setLoading(true);
          await loadUserProfile(session.user.id, session.user.email!);
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } else if (mounted) {
        console.log("No session in auth state change, setting user to null");
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up AuthProvider effect");
      mounted = false;
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
