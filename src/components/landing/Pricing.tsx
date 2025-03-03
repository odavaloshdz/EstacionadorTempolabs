import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Básico",
    id: "tier-basic",
    price: "$29",
    description:
      "Ideal para pequeños estacionamientos con operaciones simples.",
    features: [
      "1 estacionamiento",
      "Hasta 50 espacios",
      "Control de acceso básico",
      "Reportes mensuales",
      "Soporte por email",
      "1 usuario administrador",
    ],
    cta: "Comenzar gratis",
    mostPopular: false,
  },
  {
    name: "Profesional",
    id: "tier-professional",
    price: "$79",
    description:
      "Perfecto para negocios en crecimiento con múltiples ubicaciones.",
    features: [
      "Hasta 5 estacionamientos",
      "Hasta 200 espacios por ubicación",
      "Control de acceso avanzado",
      "Reportes semanales y mensuales",
      "Soporte prioritario",
      "5 usuarios administradores",
      "Integración con sistemas de pago",
      "App móvil incluida",
    ],
    cta: "Comenzar gratis",
    mostPopular: true,
  },
  {
    name: "Empresarial",
    id: "tier-enterprise",
    price: "$199",
    description:
      "Solución completa para cadenas de estacionamientos y grandes operaciones.",
    features: [
      "Estacionamientos ilimitados",
      "Espacios ilimitados",
      "Control de acceso premium",
      "Reportes personalizados",
      "Soporte 24/7",
      "Usuarios ilimitados",
      "API completa",
      "Integraciones personalizadas",
      "Implementación asistida",
      "Acuerdo de nivel de servicio",
    ],
    cta: "Contactar ventas",
    mostPopular: false,
  },
];

export default function Pricing() {
  return (
    <div id="precios" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Precios
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Planes que se adaptan a su negocio
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Elija el plan que mejor se adapte a sus necesidades. Todos los
            planes incluyen una prueba gratuita de 14 días.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-3xl p-8 ${tier.mostPopular ? "bg-gray-900 shadow-xl lg:order-2 lg:scale-110 lg:z-10" : "bg-white lg:mt-0 border border-gray-200"}`}
            >
              {tier.mostPopular ? (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 px-3 py-1 text-center text-xs font-semibold text-white">
                  Más popular
                </div>
              ) : null}
              <div className="mb-5">
                <h3
                  className={`text-lg font-semibold leading-8 ${tier.mostPopular ? "text-white" : "text-gray-900"}`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`mt-4 text-sm leading-6 ${tier.mostPopular ? "text-gray-300" : "text-gray-600"}`}
                >
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${tier.mostPopular ? "text-white" : "text-gray-900"}`}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-6 ${tier.mostPopular ? "text-gray-300" : "text-gray-600"}`}
                  >
                    /mes
                  </span>
                </p>
              </div>
              <div className="mt-2 mb-8">
                <ul role="list" className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${tier.mostPopular ? "text-blue-400" : "text-blue-600"}`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-sm leading-6 ${tier.mostPopular ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register" className="mt-auto">
                <Button
                  className={`w-full ${tier.mostPopular ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  variant={tier.mostPopular ? "outline" : "default"}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
