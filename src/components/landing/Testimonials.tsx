import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Carlos Rodríguez",
    role: "Director de Operaciones, Parking Express",
    content:
      "Desde que implementamos Estacionador, hemos aumentado nuestra eficiencia operativa en un 40%. La visualización en tiempo real nos permite tomar decisiones inmediatas y mejorar la experiencia de nuestros clientes.",
    avatar: "CR",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  },
  {
    name: "María González",
    role: "Gerente General, Estacionamientos Urbanos",
    content:
      "La capacidad de gestionar múltiples ubicaciones desde una sola plataforma ha transformado nuestra operación. Los reportes detallados nos dan visibilidad completa sobre nuestro negocio.",
    avatar: "MG",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    name: "Alejandro Méndez",
    role: "CTO, ParkSmart Solutions",
    content:
      "Como responsable de tecnología, valoro enormemente la robustez y seguridad de Estacionador. La plataforma nunca nos ha fallado, incluso en momentos de alta demanda.",
    avatar: "AM",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alejandro",
  },
  {
    name: "Laura Sánchez",
    role: "Directora Financiera, Metropolitan Parking",
    content:
      "Los informes financieros y la integración con nuestros sistemas de contabilidad han simplificado enormemente nuestros procesos. Ahora cerramos nuestros libros en la mitad del tiempo.",
    avatar: "LS",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
  },
  {
    name: "Roberto Vega",
    role: "Propietario, Estacionamientos del Centro",
    content:
      "Como pequeño empresario, Estacionador me ha permitido competir con las grandes cadenas. La facilidad de uso y el soporte al cliente son excepcionales.",
    avatar: "RV",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
  },
  {
    name: "Patricia Flores",
    role: "Gerente de Operaciones, Airport Parking",
    content:
      "La implementación fue rápida y sin complicaciones. En menos de una semana, todo nuestro equipo estaba utilizando el sistema con confianza.",
    avatar: "PF",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Testimonios
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Miles de empresas confían en Estacionador para gestionar sus
            operaciones diarias
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
