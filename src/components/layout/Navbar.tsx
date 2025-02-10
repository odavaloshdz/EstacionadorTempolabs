import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <button
            className="sm:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              ParkingPro
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                to="/#features"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Funcionalidades
              </Link>
              <Link
                to="/#precios"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Precios
              </Link>
              <Link
                to="/#contacto"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Contacto
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 py-2">
          <div className="space-y-1 px-4">
            <Link
              to="/#features"
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              to="/#precios"
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Precios
            </Link>
            <Link
              to="/#contacto"
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
