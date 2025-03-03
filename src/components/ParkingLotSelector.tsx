import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Building2 } from "lucide-react";

interface ParkingLot {
  id: string;
  name: string;
  company_id: string;
}

interface ParkingLotSelectorProps {
  onSelect: (parkingLotId: string) => void;
  selectedParkingLotId?: string;
}

export default function ParkingLotSelector({
  onSelect,
  selectedParkingLotId,
}: ParkingLotSelectorProps) {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        setLoading(true);

        // Primero verificamos si el usuario tiene acceso a múltiples estacionamientos
        const { data: companyUser, error: companyUserError } = await supabase
          .from("company_users")
          .select("*")
          .eq("user_id", user?.id)
          .single();

        if (companyUserError && companyUserError.code !== "PGRST116") {
          throw companyUserError;
        }

        let query = supabase.from("parking_lots").select("*");

        // Si el usuario está asignado a una empresa
        if (companyUser) {
          // Si el usuario tiene un estacionamiento específico asignado
          if (
            companyUser.assigned_parking_lot_id &&
            !companyUser.can_select_parking_lots
          ) {
            query = query.eq("id", companyUser.assigned_parking_lot_id);
          }
          // Si el usuario puede seleccionar estacionamientos, filtramos por su empresa
          else if (companyUser.company_id) {
            query = query.eq("company_id", companyUser.company_id);
          }
        }

        const { data, error } = await query.order("name");

        if (error) throw error;

        setParkingLots(data || []);

        // Si hay estacionamientos y no hay uno seleccionado, seleccionamos el primero
        if (data && data.length > 0 && !selectedParkingLotId) {
          onSelect(data[0].id);
        }
      } catch (error) {
        console.error("Error loading parking lots:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadParkingLots();
    }
  }, [user, onSelect, selectedParkingLotId]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Cargando...</span>
      </div>
    );
  }

  if (parkingLots.length === 0) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Sin estacionamientos</span>
      </div>
    );
  }

  if (parkingLots.length === 1) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 text-sm">
        <Building2 className="h-4 w-4" />
        <span>{parkingLots[0].name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 min-w-[200px]">
      <Building2 className="h-4 w-4" />
      <Select
        value={selectedParkingLotId || parkingLots[0]?.id}
        onValueChange={onSelect}
      >
        <SelectTrigger className="border-none bg-transparent h-8 w-full">
          <SelectValue placeholder="Seleccionar estacionamiento" />
        </SelectTrigger>
        <SelectContent>
          {parkingLots.map((lot) => (
            <SelectItem key={lot.id} value={lot.id}>
              {lot.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
