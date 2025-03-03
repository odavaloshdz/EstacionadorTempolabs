import {
  Car,
  BarChart3,
  Users,
  Shield,
  Clock,
  CreditCard,
  Smartphone,
  Building2,
  Ticket,
  Map,
  Settings,
  Zap,
} from "lucide-react";

const features = [
  {
    name: "Control en Tiempo Real",
    description:
      "Monitoree la ocupación de espacios y el flujo de vehículos en tiempo real con actualizaciones instantáneas.",
    icon: Car,
  },
  {
    name: "Reportes Detallados",
    description:
      "Acceda a análisis completos de ingresos, ocupación y tendencias con gráficos interactivos y exportación de datos.",
    icon: BarChart3,
  },
  {
    name: "Gestión Multi-Usuario",
    description:
      "Asigne roles y permisos específicos a su equipo de trabajo con control granular de acceso.",
    icon: Users,
  },
  {
    name: "Seguridad Avanzada",
    description:
      "Protección de datos y control de acceso con los más altos estándares de encriptación y autenticación.",
    icon: Shield,
  },
  {
    name: "Operación 24/7",
    description:
      "Sistema disponible todo el tiempo con respaldos automáticos y alta disponibilidad garantizada.",
    icon: Clock,
  },
  {
    name: "Múltiples Formas de Pago",
    description:
      "Integración con diferentes pasarelas de pago y opciones de facturación personalizables.",
    icon: CreditCard,
  },
  {
    name: "Aplicación Móvil",
    description:
      "Gestione su estacionamiento desde cualquier lugar con nuestra aplicación móvil intuitiva.",
    icon: Smartphone,
  },
  {
    name: "Multi-Estacionamiento",
    description:
      "Administre múltiples ubicaciones desde una sola plataforma centralizada y unificada.",
    icon: Building2,
  },
  {
    name: "Sistema de Tickets",
    description:
      "Generación automática de tickets con códigos QR y opciones de impresión personalizables.",
    icon: Ticket,
  },
  {
    name: "Visualización en Mapa",
    description:
      "Vea la distribución de sus espacios en un mapa interactivo con información en tiempo real.",
    icon: Map,
  },
  {
    name: "Personalización Total",
    description:
      "Adapte el sistema a sus necesidades específicas con opciones de configuración avanzadas.",
    icon: Settings,
  },
  {
    name: "Rendimiento Optimizado",
    description:
      "Plataforma de alta velocidad diseñada para manejar grandes volúmenes de datos sin ralentizaciones.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Funcionalidades Avanzadas
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Todo lo que necesita para gestionar sus estacionamientos
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Nuestra plataforma ofrece todas las herramientas necesarias para
            optimizar la gestión de sus estacionamientos, desde el control de
            acceso hasta reportes financieros detallados.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:max-w-none">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16 group">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 group-hover:bg-blue-700 transition-colors duration-200">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
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
