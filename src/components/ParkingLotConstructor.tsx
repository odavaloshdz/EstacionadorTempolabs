import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ParkingSpace from "./ParkingSpace";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ParkingLotConstructorProps {
  rows?: number;
  columns?: number;
  onSpaceClick?: (spaceId: string) => void;
  spaces?: Array<{
    id: string;
    isOccupied: boolean;
    vehicleType?: "auto" | "moto" | "camioneta" | "camion" | "van";
  }>;
}

const SPACES_PER_PAGE = 50; // Ajusta este número según necesites

const ParkingLotConstructor = ({
  rows = 3,
  columns = 4,
  onSpaceClick = () => {},
  spaces = [],
}: ParkingLotConstructorProps) => {
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 0.8 : 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });

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

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Diseño del Estacionamiento</h2>
        <div className="flex items-center gap-2">
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
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
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
              onClick={() => onSpaceClick(space.id)}
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
