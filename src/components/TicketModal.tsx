import React from "react";
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
import { Clock, CreditCard, Car, Calendar } from "lucide-react";

interface TicketModalProps {
  open?: boolean;
  onClose?: () => void;
  isEntry?: boolean;
  ticketData?: {
    ticketNumber: string;
    entryTime: string;
    exitTime?: string;
    duration?: string;
    amount?: number;
    licensePlate: string;
  };
}

const TicketModal = ({
  open = true,
  onClose = () => {},
  isEntry = true,
  ticketData = {
    ticketNumber: "T-001",
    entryTime: new Date().toLocaleString(),
    licensePlate: "ABC-123",
  },
}: TicketModalProps) => {
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

              <div className="space-y-2">
                <Label>Placa</Label>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  {isEntry ? (
                    <Input
                      placeholder="Ingrese la placa"
                      defaultValue={ticketData.licensePlate}
                    />
                  ) : (
                    <span className="text-sm">{ticketData.licensePlate}</span>
                  )}
                </div>
              </div>

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
          <Button onClick={onClose}>
            {isEntry ? "Crear Ticket" : "Procesar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
