import React from "react";
import ParkingLotConstructor from "./ParkingLotConstructor";
import ActionPanel from "./ActionPanel";
import { VehicleType } from "@/types/parking";

interface ParkingDisplayProps {
  spaces: Array<{
    id: string;
    isOccupied: boolean;
    vehicleType?: VehicleType;
  }>;
  stats: {
    totalSpaces: number;
    availableSpaces: number;
    occupiedSpaces: number;
  };
  onSpaceClick: (spaceId: string) => void;
  onEmptyParking: () => void;
  onCreateTicket: () => void;
  onProcessPayment: () => void;
}

const ParkingDisplay: React.FC<ParkingDisplayProps> = ({
  spaces,
  stats,
  onSpaceClick,
  onEmptyParking,
  onCreateTicket,
  onProcessPayment
}) => {
  return (
    <>
      <div className="md:hidden bg-white border-b p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="text-sm">
            Disponibles:{" "}
            <span className="text-green-600 font-bold">
              {stats.availableSpaces}
            </span>
          </span>
          <span className="text-sm">
            Ocupados:{" "}
            <span className="text-red-600 font-bold">
              {stats.occupiedSpaces}
            </span>
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onCreateTicket}
            className="p-2 text-sm bg-primary text-white rounded-md"
          >
            + Ticket
          </button>
        </div>
      </div>
      <div className="flex-1 flex md:flex-row">
        <div className="flex-1 p-2 md:p-6 overflow-hidden">
          <div className="mb-2 md:mb-6 hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Estacionamiento
            </h1>
            <p className="text-gray-500">
              Administre sus espacios y tickets de estacionamiento
            </p>
          </div>
          <div className="h-[calc(100%-20px)] md:h-[calc(100%-100px)]">
            <ParkingLotConstructor
              spaces={spaces}
              onSpaceClick={onSpaceClick}
            />
          </div>
        </div>
        <div className="hidden md:block">
          <ActionPanel
            parkingStats={stats}
            onEmptyParking={onEmptyParking}
            onCreateTicket={onCreateTicket}
            onProcessPayment={onProcessPayment}
          />
        </div>
      </div>
    </>
  );
};

export default ParkingDisplay; 