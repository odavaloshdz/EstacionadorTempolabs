import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ParkingSpace from "./ParkingSpace";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const SPACES_PER_PAGE = 100; // Ajusta este número según necesites

const ParkingLotConstructor = ({
  rows = 3,
  columns = 4,
  onSpaceClick = () => {},
  spaces = [],
}: ParkingLotConstructorProps) => {
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 0.8 : 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (spaces.length === 0) return;

    const totalSpaces = getCurrentPageSpaces().length;
    const aspectRatio = 16 / 9; // Proporción aproximada de la pantalla

    // Calcular el número óptimo de columnas basado en el número de espacios
    let optimalColumns = Math.ceil(Math.sqrt(totalSpaces * aspectRatio));
    let optimalRows = Math.ceil(totalSpaces / optimalColumns);

    // Ajustar para móviles
    const handleResize = () => {
      if (window.innerWidth < 768) {
        optimalColumns = Math.min(2, optimalColumns); // Máximo 2 columnas en móvil
        optimalRows = Math.ceil(totalSpaces / optimalColumns);
      } else if (optimalRows > 8) {
        optimalColumns = Math.ceil(totalSpaces / 8);
        optimalRows = 8;
      }

      // Asegurar que siempre tengamos al menos 1 columna y 1 fila
      optimalColumns = Math.max(1, optimalColumns);
      optimalRows = Math.max(1, optimalRows);

      setGridDimensions({
        width: optimalColumns,
        height: optimalRows,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [spaces.length, currentPage, getCurrentPageSpaces]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const refreshSpaces = () => {
    setLoading(true);
    // Simulate refresh by waiting a bit
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    // Trigger a re-render by changing the page and then going back
    let pageChangeTimer: number;
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      pageChangeTimer = window.setTimeout(
        () => setCurrentPage((prev) => prev - 1),
        100,
      );
    } else if (totalPages > 1) {
      setCurrentPage((prev) => prev - 1);
      pageChangeTimer = window.setTimeout(
        () => setCurrentPage((prev) => prev + 1),
        100,
      );
    }

    return () => {
      clearTimeout(timer);
      if (pageChangeTimer) clearTimeout(pageChangeTimer);
    };
  };

  return (
    <div
      className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full h-full flex flex-col gap-4"
      ref={containerRef}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Diseño del Estacionamiento</h2>
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="grid"
            className="w-[200px]"
            onValueChange={(value) => setViewMode(value as "grid" | "list")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="icon"
            onClick={refreshSpaces}
            className="ml-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <div className="flex items-center ml-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-2 text-sm">
              Página {totalPages > 0 ? currentPage : 0} de {totalPages}
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

          {viewMode === "grid" && (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {spaces.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col">
            <p className="text-gray-500 mb-4">
              No hay espacios configurados para este estacionamiento
            </p>
            <p className="text-sm text-gray-400">
              Vaya a Configuración para crear espacios
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div
            className="grid gap-4 p-4"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              gridTemplateColumns: `repeat(${Math.max(1, gridDimensions.width)}, minmax(120px, 1fr))`,
              gridGap: "1rem",
              width: `${100 / zoom}%`,
            }}
          >
            {getCurrentPageSpaces().length > 0 ? (
              getCurrentPageSpaces().map((space) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No hay espacios en esta página</p>
              </div>
            )}
          </div>
        ) : (
          // List view
          <div className="overflow-auto border rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Espacio
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageSpaces().length > 0 ? (
                  getCurrentPageSpaces().map((space) => (
                    <tr key={space.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {space.id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${space.isOccupied ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                        >
                          {space.isOccupied ? "Ocupado" : "Disponible"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap capitalize">
                        {space.vehicleType || "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSpaceClick(space.id)}
                        >
                          {space.isOccupied
                            ? "Procesar Salida"
                            : "Registrar Entrada"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No hay espacios en esta página
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLotConstructor;
