export type VehicleType = "auto" | "moto" | "camioneta" | "otro";

export interface VehicleInfo {
  plate: string;
  color?: string;
  model?: string;
  type: VehicleType;
}

export interface TicketData {
  ticketNumber: string;
  entryTime: string;
  exitTime?: string;
  duration?: string;
  amount?: number;
  licensePlate: string;
  vehicleInfo?: VehicleInfo;
  createdBy?: string;
}
