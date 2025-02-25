import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ParkingSpace from "./ParkingSpace";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ChevronLeft, ChevronRight, Edit, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { VehicleType } from "@/types/parking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_PERMISSIONS } from "@/types/auth";

interface ParkingLotConstructorProps {
  rows?: number;
  columns?: number;
  onSpaceClick?: (spaceId: string) => void;
  spaces?: Array<{
    id: string;
    isOccupied: boolean;
    vehicleType?: VehicleType;
    spaceType?: "regular" | "handicap" | "reserved" | "nonParking";
  }>;
  onSpaceTypeChange?: (spaceId: string, spaceType: string) => void;
}

const SPACES_PER_PAGE = 50; // Ajusta este número según necesites

const ParkingLotConstructor = ({
  rows = 3,
  columns = 4,
  onSpaceClick = () => {},
  spaces = [],
  onSpaceTypeChange = () => {},
}: ParkingLotConstructorProps) => {
  const { user } = useAuth();
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 0.8 : 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  // Verificar si el usuario tiene permisos para editar
  const canEdit = user && ROLE_PERMISSIONS[user.role].includes("settings.edit");

  // Calcular el número total de páginas
  const totalPages = Math.ceil(spaces.length / SPACES_PER_PAGE);

  // Obtener los espacios para la página actual
  const getCurrentPageSpaces = () => {
    const start = (currentPage - 1) * SPACES_PER_PAGE;
    const end = start + SPACES_PER_PAGE;
    return spaces.slice(start, end);
  };

  // Calcular dimensiones óptimas de la cuadrícula
  useEffect(() => {
    const totalSpaces = getCurrentPageSpaces().length;
    const aspectRatio = 16 / 9; // Proporción aproximada de la pantalla

    // Calcular el número óptimo de columnas basado en el número de espacios
    let optimalColumns = Math.ceil(Math.sqrt(totalSpaces * aspectRatio));
    let optimalRows = Math.ceil(totalSpaces / optimalColumns);

    // Ajustar para móviles
    if (window.innerWidth < 768) {
      optimalColumns = Math.min(2, optimalColumns); // Máximo 2 columnas en móvil
      optimalRows = Math.ceil(totalSpaces / optimalColumns);
    } else if (optimalRows > 8) {
      optimalColumns = Math.ceil(totalSpaces / 8);
      optimalRows = 8;
    }

    setGridDimensions({
      width: optimalColumns,
      height: optimalRows,
    });
  }, [spaces.length, currentPage]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleSpaceClick = (spaceId: string) => {
    if (isEditing) {
      setSelectedSpace(selectedSpace === spaceId ? null : spaceId);
    } else {
      onSpaceClick(spaceId);
    }
  };

  const handleSpaceTypeChange = (type: string) => {
    if (selectedSpace && isEditing) {
      onSpaceTypeChange(selectedSpace, type);
    }
  };

  const toggleEditMode = () => {
    if (!canEdit) return;
    setIsEditing(!isEditing);
    setSelectedSpace(null);
  };

  // Definición de tipos de espacios para el selector
  const spaceTypes = [
    { value: "regular", label: "Regular" },
    { value: "handicap", label: "Discapacitados" },
    { value: "reserved", label: "Reservado" },
    { value: "nonParking", label: "No Estacionable" },
  ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Diseño del Estacionamiento</h2>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={toggleEditMode}
                className={isEditing ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? "Modo Edición" : "Editar"}
              </Button>
              <Separator orientation="vertical" className="h-8" />
            </>
          )}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-2 text-sm">
              Página {currentPage} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 2}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isEditing && selectedSpace && (
        <div className="bg-gray-100 p-3 rounded-md mb-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium">Espacio {selectedSpace}:</span>
            <Select 
              onValueChange={handleSpaceTypeChange}
              value={spaces.find(s => s.id === selectedSpace)?.spaceType || "regular"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de espacio" />
              </SelectTrigger>
              <SelectContent>
                {spaceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div
          className="grid gap-4 p-4"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            gridTemplateColumns: `repeat(${gridDimensions.width}, minmax(120px, 1fr))`,
            gridGap: "1rem",
            width: `${100 / zoom}%`,
          }}
        >
          {getCurrentPageSpaces().map((space) => (
            <ParkingSpace
              key={space.id}
              spaceNumber={space.id}
              isOccupied={space.isOccupied}
              vehicleType={space.vehicleType}
              spaceType={space.spaceType || "regular"}
              isEditing={isEditing}
              isSelected={selectedSpace === space.id}
              onClick={() => handleSpaceClick(space.id)}
              className={cn(
                "transition-transform hover:scale-105",
                "shadow-sm hover:shadow-md",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkingLotConstructor;
