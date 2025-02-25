import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CreditCard, Car, Calendar, Palette, Type } from "lucide-react";
import { printTicket, printReceipt } from "@/lib/printService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { TicketData, VehicleType } from "@/types/parking";

interface TicketModalProps {
  open?: boolean;
  onClose?: () => void;
  isEntry?: boolean;
  ticketData?: TicketData;
  onSubmit?: (data: TicketData) => void;
}

const vehicleTypes: VehicleType[] = [
  "auto",
  "moto",
  "camioneta",
  "otro"
];

const TicketModal = ({
  open = true,
  onClose = () => {},
  isEntry = true,
  ticketData = {
    ticketNumber: "T-001",
    entryTime: new Date().toLocaleString(),
    licensePlate: "ABC-123",
  },
  onSubmit = () => {},
}: TicketModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    plate: ticketData?.licensePlate || "",
    color: "",
    model: "",
    type: "auto" as VehicleType,
  });

  const calculateAmount = async (entryTime: string) => {
    const entry = new Date(entryTime);
    const exit = new Date();
    const hours = Math.ceil(
      (exit.getTime() - entry.getTime()) / (1000 * 60 * 60),
    );

    const { data: settings } = await supabase
      .from("parking_settings")
      .select("*")
      .single();

    if (!settings) return 10; // default rate

    const rates = {
      auto: settings.rate_auto || 10,
      moto: settings.rate_moto || 5,
      camioneta: settings.rate_camioneta || 15,
      otro: settings.rate_auto || 10, // Usar la tarifa de auto como predeterminada para "otro"
    };

    return hours * (rates[formData.type] || rates.auto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTicketData = {
      ...ticketData,
      licensePlate: formData.plate,
      vehicleInfo: {
        plate: formData.plate,
        color: formData.color || undefined,
        model: formData.model || undefined,
        type: formData.type,
      },
      createdBy: user?.email,
    };

    try {
      if (!isEntry) {
        updatedTicketData.amount = await calculateAmount(ticketData.entryTime);
      }

      // Primero actualizamos el estado y la base de datos
      await onSubmit(updatedTicketData);

      // Luego imprimimos el ticket
      if (isEntry) {
        await printTicket(updatedTicketData);
      } else if (updatedTicketData.exitTime) {
        await printReceipt(updatedTicketData);
      }

      // Cerramos el modal después de que todo esté listo
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEntry ? "Crear Ticket de Entrada" : "Procesar Ticket de Salida"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Ticket #{ticketData.ticketNumber}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora de Entrada</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{ticketData.entryTime}</span>
                  </div>
                </div>

                {!isEntry && ticketData.exitTime && (
                  <div className="space-y-2">
                    <Label>Hora de Salida</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{ticketData.exitTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {isEntry ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Placa</Label>
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Ingrese la placa"
                        value={formData.plate}
                        onChange={(e) =>
                          setFormData({ ...formData, plate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color (Opcional)</Label>
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Color del vehículo"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Modelo (Opcional)</Label>
                    <div className="flex items-center space-x-2">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Modelo del vehículo"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Vehículo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value as VehicleType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Placa</Label>
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{ticketData.licensePlate}</span>
                  </div>
                </div>
              )}

              {!isEntry && (
                <>
                  <div className="space-y-2">
                    <Label>Duración</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {ticketData.duration || "2 hours"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Monto a Pagar</Label>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">
                        ${ticketData.amount || "10.00"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {isEntry ? "Crear Ticket" : "Procesar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
