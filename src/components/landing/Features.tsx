import { Car, BarChart3, Users, Shield } from "lucide-react";

const features = [
  {
    name: "Control en Tiempo Real",
    description:
      "Monitoree la ocupación de espacios y el flujo de vehículos en tiempo real.",
    icon: Car,
  },
  {
    name: "Reportes Detallados",
    description:
      "Acceda a análisis completos de ingresos, ocupación y tendencias.",
    icon: BarChart3,
  },
  {
    name: "Gestión Multi-Usuario",
    description: "Asigne roles y permisos específicos a su equipo de trabajo.",
    icon: Users,
  },
  {
    name: "Seguridad Avanzada",
    description:
      "Protección de datos y control de acceso con los más altos estándares.",
    icon: Shield,
  },
];

export default function Features() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Funcionalidades
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesita para gestionar sus estacionamientos
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-16 lg:max-w-none">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-start">
                <div className="rounded-lg bg-primary/10 p-2 ring-1 ring-primary/10">
                  <feature.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <dt className="mt-4 font-semibold text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-2 leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
