export type VehicleType = "auto" | "moto" | "camioneta" | "camion" | "van";
export type BillingType = "hourly" | "hotel" | "free";

export interface VehicleInfo {
  plate: string;
  color?: string;
  model?: string;
  type: VehicleType;
  leaveKeys: boolean;
}

export interface TicketData {
  ticketNumber: string;
  entryTime: string;
  exitTime?: string;
  duration?: string;
  amount?: number;
  promotionalRate?: number;
  licensePlate: string;
  vehicleInfo?: VehicleInfo;
  createdBy?: string;
  notes?: string;
  billingType: BillingType;
  parkingLotId: string;
}
