import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-full my-2">
        <div
          className="flex justify-between items-center h-16 relative px-4 py-2 rounded-full border border-gray-200/20"
          style={{
            background: scrolled
              ? "rgba(255, 255, 255, 0.5)"
              : "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center">
            <Link to="/">
              <Logo color={scrolled ? "default" : "white"} />
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a
                href="#features"
                className={`${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-gray-200"} font-medium px-3 py-2 rounded-md transition-colors duration-200`}
              >
                Funcionalidades
              </a>
              <a
                href="#precios"
                className={`${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-gray-200"} font-medium px-3 py-2 rounded-md transition-colors duration-200`}
              >
                Precios
              </a>
              <a
                href="#contacto"
                className={`${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-gray-200"} font-medium px-3 py-2 rounded-md transition-colors duration-200`}
              >
                Contacto
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hidden sm:block">
              <Button
                variant={scrolled ? "outline" : "secondary"}
                className={
                  scrolled ? "" : "text-blue-600 bg-white hover:bg-gray-100"
                }
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button
                className={
                  scrolled
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-white text-blue-600 hover:bg-gray-100"
                }
              >
                Registrarse
              </Button>
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X
                  className={`h-6 w-6 ${scrolled ? "text-gray-900" : "text-white"}`}
                />
              ) : (
                <Menu
                  className={`h-6 w-6 ${scrolled ? "text-gray-900" : "text-white"}`}
                />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4">
          <div className="space-y-2 px-4">
            <a
              href="#features"
              className="block text-gray-600 hover:text-gray-900 px-3 py-3 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </a>
            <a
              href="#precios"
              className="block text-gray-600 hover:text-gray-900 px-3 py-3 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Precios
            </a>
            <a
              href="#contacto"
              className="block text-gray-600 hover:text-gray-900 px-3 py-3 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>
            <div className="pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="block text-center text-gray-600 hover:text-gray-900 px-3 py-3 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
