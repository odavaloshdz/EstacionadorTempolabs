import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Logo color="white" />
            <p className="text-gray-400 text-sm max-w-xs">
              La plataforma líder en gestión de estacionamientos. Soluciones
              inteligentes para optimizar sus operaciones.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Soluciones
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Estacionamientos Comerciales
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Estacionamientos Residenciales
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Aeropuertos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Centros Comerciales
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Hoteles
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Soporte
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Centro de Ayuda
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Documentación
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Guías
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Estado del Sistema
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Empresa
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Sobre Nosotros
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Empleos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Prensa
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Socios
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Privacidad
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Términos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Cookies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Licencias
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Configuración
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} Estacionador. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
