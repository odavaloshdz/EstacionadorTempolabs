import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-white pt-24 pb-12 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Sistema Inteligente de Gestión de Estacionamientos
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Optimice la gestión de sus estacionamientos con nuestra solución
            integral. Control en tiempo real, reportes detallados y gestión
            eficiente de espacios.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link to="/login">
              <Button size="lg">Acceder al Sistema</Button>
            </Link>
            <Link to="/#features">
              <Button variant="outline" size="lg">
                Saber Más
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
