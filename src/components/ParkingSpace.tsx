import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Car, Bike, Truck, HelpCircle, AccessibilityIcon, Star } from "lucide-react";
import { VehicleType } from "@/types/parking";

interface ParkingSpaceProps {
  spaceNumber?: string;
  isOccupied?: boolean;
  onClick?: () => void;
  className?: string;
  vehicleType?: VehicleType;
  spaceType?: "regular" | "handicap" | "reserved" | "nonParking";
  isEditing?: boolean;
  isSelected?: boolean;
}

// Definición de tipos de espacios y sus colores
const spaceTypeConfig = {
  regular: { 
    name: 'Regular', 
    color: 'bg-blue-500', 
    borderColor: 'border-blue-600',
    textColor: 'text-blue-100',
    icon: Car 
  },
  handicap: { 
    name: 'Discapacitados', 
    color: 'bg-purple-500', 
    borderColor: 'border-purple-600',
    textColor: 'text-purple-100',
    icon: AccessibilityIcon 
  },
  reserved: { 
    name: 'Reservado', 
    color: 'bg-yellow-500', 
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-100',
    icon: Star 
  },
  nonParking: { 
    name: 'No Estacionable', 
    color: 'bg-gray-500', 
    borderColor: 'border-gray-600',
    textColor: 'text-gray-100',
    icon: HelpCircle 
  }
};

const ParkingSpace = ({
  spaceNumber = "A1",
  isOccupied = false,
  onClick = () => {},
  className,
  vehicleType = "auto",
  spaceType = "regular",
  isEditing = false,
  isSelected = false,
}: ParkingSpaceProps) => {
  const getVehicleIcon = () => {
    switch (vehicleType) {
      case "moto":
        return Bike;
      case "camioneta":
        return Truck;
      case "otro":
        return HelpCircle;
      default:
        return Car;
    }
  };

  const VehicleIcon = getVehicleIcon();
  const status = isOccupied ? "Ocupado" : "Disponible";
  
  // Determinar colores basados en el tipo de espacio y estado
  let bgColor, borderColor, textColor, SpaceIcon;
  
  if (isEditing) {
    // En modo edición, mostrar colores según el tipo de espacio
    const config = spaceTypeConfig[spaceType];
    bgColor = config.color;
    borderColor = config.borderColor;
    textColor = config.textColor;
    SpaceIcon = config.icon;
  } else if (spaceType === 'nonParking') {
    // Espacios no estacionables siempre se muestran igual
    bgColor = spaceTypeConfig.nonParking.color;
    borderColor = spaceTypeConfig.nonParking.borderColor;
    textColor = spaceTypeConfig.nonParking.textColor;
    SpaceIcon = spaceTypeConfig.nonParking.icon;
  } else {
    // En modo normal, mostrar colores según ocupación
    bgColor = isOccupied ? "bg-red-500" : "bg-green-500";
    borderColor = isOccupied ? "border-red-600" : "border-green-600";
    textColor = isOccupied ? "text-red-100" : "text-green-100";
    SpaceIcon = VehicleIcon;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "w-[120px] md:w-[100px] h-[180px] md:h-[150px] border-2 rounded-md p-2 cursor-pointer",
              "transition-colors duration-200 ease-in-out",
              "flex flex-col items-center justify-between",
              bgColor,
              borderColor,
              isSelected && "ring-4 ring-blue-300",
              className,
            )}
            onClick={onClick}
            role="button"
            tabIndex={0}
          >
            <span className={cn("text-sm font-semibold", "text-white")}>{spaceNumber}</span>
            <SpaceIcon
              className={cn(
                "w-12 h-12",
                "text-white opacity-80"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                "text-white"
              )}
            >
              {isEditing ? spaceTypeConfig[spaceType].name : status}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isEditing 
              ? `Espacio ${spaceNumber} - ${spaceTypeConfig[spaceType].name}` 
              : `Espacio ${spaceNumber} - ${status}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ParkingSpace;
