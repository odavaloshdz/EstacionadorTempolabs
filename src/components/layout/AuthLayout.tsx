import { Logo } from "@/components/ui/logo";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
    label: string;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center rounded-full my-2 py-2 bg-white/50 backdrop-blur-sm shadow-sm border border-gray-200/20">
          <Link to="/">
            <Logo variant="full" />
          </Link>
          <nav className="flex space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-blue-600">
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[center_top_-1px] dark:bg-grid-slate-400/[0.05] dark:bg-[center_top] opacity-30"></div>
        <div className="relative w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
          {children}
          {footerText && footerLink && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {footerText}{" "}
                <Link
                  to={footerLink.href}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {footerLink.label}
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo color="white" variant="full" />
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Estacionador. Todos los derechos
              reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
