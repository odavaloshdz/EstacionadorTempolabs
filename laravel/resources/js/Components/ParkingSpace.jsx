import React from "react";
import { Car, Bike, Truck, AlertTriangle } from "lucide-react";

export default function ParkingSpace({
    spaceId,
    isOccupied = false,
    vehicleType = null,
    spaceType = "regular",
    isSelected = false,
    onClick = () => {},
}) {
    // Determinar el color de fondo basado en el tipo de espacio y si está ocupado
    const getBgColor = () => {
        if (isSelected) return "bg-yellow-200";
        
        if (spaceType === "handicap") return isOccupied ? "bg-blue-700" : "bg-blue-200";
        if (spaceType === "reserved") return isOccupied ? "bg-purple-700" : "bg-purple-200";
        if (spaceType === "nonParking") return "bg-red-200";
        
        return isOccupied ? "bg-red-600" : "bg-green-500";
    };
    
    // Determinar el ícono basado en el tipo de vehículo
    const getVehicleIcon = () => {
        if (!isOccupied) return null;
        
        switch (vehicleType) {
            case "moto":
                return <Bike className="h-6 w-6 text-white" />;
            case "camioneta":
                return <Truck className="h-6 w-6 text-white" />;
            case "otro":
                return <AlertTriangle className="h-6 w-6 text-white" />;
            default:
                return <Car className="h-6 w-6 text-white" />;
        }
    };
    
    // Determinar el texto de estado
    const getStatusText = () => {
        if (spaceType === "nonParking") return "No Estacionar";
        if (spaceType === "handicap") return isOccupied ? "Ocupado (D)" : "Discapacitados";
        if (spaceType === "reserved") return isOccupied ? "Ocupado (R)" : "Reservado";
        
        return isOccupied ? "Ocupado" : "Libre";
    };
    
    return (
        <div
            className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md p-2 shadow-md transition-all duration-200 hover:shadow-lg ${getBgColor()} ${isSelected ? "ring-4 ring-yellow-500" : ""}`}
            onClick={() => onClick(spaceId)}
        >
            <div className="mb-1 text-lg font-bold text-white">{spaceId}</div>
            
            <div className="flex items-center justify-center">
                {getVehicleIcon()}
            </div>
            
            <div className="mt-1 text-xs font-medium text-white">
                {getStatusText()}
            </div>
        </div>
    );
} 