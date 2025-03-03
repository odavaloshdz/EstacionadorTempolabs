import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[center_top_-1px] dark:bg-grid-slate-400/[0.05] dark:bg-[center_top] opacity-30"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
            Solución SaaS Multi-Tenant
          </div>
          <div className="flex justify-center mb-6">
            <img
              src="/Estacionador Logo.png"
              alt="Estacionador Logo"
              className="h-28 md:h-36 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Gestión Inteligente
            </span>{" "}
            de Estacionamientos
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Optimice la gestión de sus estacionamientos con nuestra plataforma
            integral. Control en tiempo real, reportes detallados y gestión
            eficiente de espacios.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Comenzar Gratis
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-gray-50 transition-all duration-200"
              >
                Iniciar Sesión
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            No se requiere tarjeta de crédito • Configuración en minutos •
            Soporte 24/7
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
          <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="Dashboard de Estacionador"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600">99.9%</div>
            <div className="text-gray-600">Tiempo de actividad</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600">+500</div>
            <div className="text-gray-600">Clientes satisfechos</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600">+10,000</div>
            <div className="text-gray-600">Estacionamientos</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600">Soporte técnico</div>
          </div>
        </div>
      </div>
    </div>
  );
}
