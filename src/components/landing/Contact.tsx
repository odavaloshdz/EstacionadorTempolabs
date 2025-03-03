import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div id="contacto" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Contacto
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Listo para optimizar su estacionamiento?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Nuestro equipo está listo para ayudarle a implementar la solución
            perfecta para su negocio.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Envíenos un mensaje
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <Input id="email" name="email" type="email" className="mt-1" />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <Input id="phone" name="phone" type="tel" className="mt-1" />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Enviar mensaje
              </Button>
            </form>
          </div>

          <div className="rounded-2xl bg-gray-50 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Información de contacto
              </h3>
              <dl className="space-y-6">
                <div className="flex gap-x-4">
                  <dt>
                    <Mail
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd>
                    <p className="text-sm font-medium text-gray-900">
                      Correo electrónico
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      info@estacionador.com
                    </p>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt>
                    <Phone
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd>
                    <p className="text-sm font-medium text-gray-900">
                      Teléfono
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      +52 (55) 1234-5678
                    </p>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt>
                    <MapPin
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd>
                    <p className="text-sm font-medium text-gray-900">
                      Dirección
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Av. Reforma 222, Col. Juárez
                    </p>
                    <p className="text-sm text-gray-500">
                      Ciudad de México, CP 06600
                    </p>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Horario de atención
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                </p>
                <p className="text-sm text-gray-500">
                  Sábados: 10:00 AM - 2:00 PM
                </p>
                <p className="text-sm text-gray-500">Domingos: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
