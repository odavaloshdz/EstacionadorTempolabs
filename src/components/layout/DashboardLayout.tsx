import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Settings, LogOut, Menu, X, Users, User, ChevronDown } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/types/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Definición de colores para roles
const roleColors: Record<UserRole, string> = {
  admin: "bg-red-500 text-white",
  employee: "bg-green-500 text-white",
};

// Nombres amigables para roles
const roleNames: Record<UserRole, string> = {
  admin: "Administrador",
  employee: "Empleado",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { signOut, user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: LayoutGrid,
      label: "Dashboard",
      href: "/dashboard",
    },
    hasPermission("users.view") && {
      icon: Users,
      label: "Usuarios",
      href: "/dashboard/users",
    },
    {
      icon: Settings,
      label: "Configuración",
      href: "/dashboard/settings",
    },
  ].filter(Boolean);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200",
          isSidebarOpen ? "w-64" : "w-16",
          "hidden md:block",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <span
              className={cn("font-bold text-xl", !isSidebarOpen && "hidden")}
            >
              Estacionador
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* User info section */}
          {isSidebarOpen && user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${roleColors[user.role]}`}>
                  {roleNames[user.role]}
                </span>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(
              (item) =>
                item && (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      !isSidebarOpen && "justify-center",
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                ),
            )}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                !isSidebarOpen && "justify-center",
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {isSidebarOpen && <span>Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden border-b bg-white">
        <div className="flex items-center justify-between p-4">
          <span className="font-bold text-xl">Estacionador</span>
          <div className="flex items-center gap-2">
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 bg-gray-100 p-2 rounded-md"
                >
                  <User size={18} />
                  <span className="text-sm">{user.first_name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${roleColors[user.role]}`}>
                    {roleNames[user.role]}
                  </span>
                  <ChevronDown size={14} />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="p-2 border-b">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="border-t p-4 bg-white space-y-2">
            {menuItems.map(
              (item) =>
                item && (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span>{item.label}</span>
                  </Button>
                ),
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-200",
          "md:ml-16",
          isSidebarOpen && "md:ml-64",
        )}
      >
        {children}
      </main>
    </div>
  );
}
