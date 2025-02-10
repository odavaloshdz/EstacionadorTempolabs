import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Car } from "lucide-react";

interface ParkingSpaceProps {
  spaceNumber?: string;
  isOccupied?: boolean;
  onClick?: () => void;
  className?: string;
}

const ParkingSpace = ({
  spaceNumber = "A1",
  isOccupied = false,
  onClick = () => {},
  className,
}: ParkingSpaceProps) => {
  const status = isOccupied ? "Ocupado" : "Disponible";
  const statusColor = isOccupied ? "bg-red-100" : "bg-green-100";
  const borderColor = isOccupied ? "border-red-500" : "border-green-500";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "w-[80px] md:w-[100px] h-[120px] md:h-[150px] border-2 rounded-md p-2 cursor-pointer",
              "transition-colors duration-200 ease-in-out",
              "flex flex-col items-center justify-between",
              statusColor,
              borderColor,
              className,
            )}
            onClick={onClick}
            role="button"
            tabIndex={0}
          >
            <span className="text-sm font-semibold">{spaceNumber}</span>
            <Car
              className={cn(
                "w-12 h-12",
                isOccupied ? "text-red-500" : "text-green-500",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                isOccupied ? "text-red-700" : "text-green-700",
              )}
            >
              {status}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Space {spaceNumber} - {status}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ParkingSpace;
