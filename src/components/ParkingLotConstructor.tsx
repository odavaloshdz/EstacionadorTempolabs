import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ParkingSpace from "./ParkingSpace";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface ParkingLotConstructorProps {
  rows?: number;
  columns?: number;
  onSpaceClick?: (spaceId: string) => void;
  spaces?: Array<{
    id: string;
    isOccupied: boolean;
  }>;
}

const ParkingLotConstructor = ({
  rows = 3,
  columns = 4,
  onSpaceClick = () => {},
  spaces = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: `A${index + 1}`,
      isOccupied: Math.random() > 0.5,
    })),
}: ParkingLotConstructorProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Diseño del Estacionamiento</h2>
        <div className="flex gap-2">
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

      <div className="flex-1 overflow-auto">
        <div
          className="grid gap-4 p-4"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            gridTemplateColumns: `repeat(${columns}, minmax(100px, 1fr))`,
            width: `${100 / zoom}%`,
          }}
        >
          {spaces.map((space, index) => (
            <ParkingSpace
              key={space.id}
              spaceNumber={space.id}
              isOccupied={space.isOccupied}
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
