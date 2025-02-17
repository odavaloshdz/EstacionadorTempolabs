import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, CreditCard, LogOut, Plus, Ticket, Trash2 } from "lucide-react";

interface ActionPanelProps {
  onCreateTicket?: () => void;
  onProcessPayment?: () => void;
  onEndParking?: () => void;
  onEmptyParking?: () => void;
  parkingStats?: {
    totalSpaces: number;
    availableSpaces: number;
    occupiedSpaces: number;
  };
}

const ActionPanel = ({
  onCreateTicket = () => {},
  onProcessPayment = () => {},
  onEndParking = () => {},
  onEmptyParking = () => {},
  parkingStats = {
    totalSpaces: 50,
    availableSpaces: 30,
    occupiedSpaces: 20,
  },
}: ActionPanelProps) => {
  return (
    <div className="w-full md:w-[300px] h-auto md:h-full bg-white p-4 border-t md:border-t-0 md:border-l border-gray-200">
      <Card>
        <CardHeader>
          <CardTitle>Estado del Estacionamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Espacios Totales</span>
              <span className="font-medium">{parkingStats.totalSpaces}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Disponibles</span>
              <span className="font-medium text-green-600">
                {parkingStats.availableSpaces}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Ocupados</span>
              <span className="font-medium text-red-600">
                {parkingStats.occupiedSpaces}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <div className="space-y-4">
        <Button
          className="w-full justify-start"
          onClick={onCreateTicket}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Ticket
        </Button>

        <Button
          className="w-full justify-start"
          onClick={onProcessPayment}
          variant="outline"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Procesar Pago
        </Button>

        <Button
          className="w-full justify-start"
          onClick={onEndParking}
          variant="outline"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Finalizar Estacionamiento
        </Button>

        <Button
          className="w-full justify-start"
          onClick={onEmptyParking}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Vaciar Estacionamiento
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Hora Actual
          </div>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Ticket className="mr-2 h-4 w-4" />
            Tickets Activos
          </div>
          <span>{parkingStats.occupiedSpaces}</span>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;
