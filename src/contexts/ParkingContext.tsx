import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

interface ParkingLot {
  id: string;
  name: string;
  company_id: string;
  capacity: number;
  hourly_rate: number;
  address?: string;
  status: string;
}

interface ParkingContextType {
  selectedParkingLotId: string | null;
  setSelectedParkingLotId: (id: string) => void;
  parkingLots: ParkingLot[];
  loading: boolean;
  error: string | null;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: ReactNode }) {
  const [selectedParkingLotId, setSelectedParkingLotId] = useState<
    string | null
  >(localStorage.getItem("selectedParkingLotId"));
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Loading parking lots...");

        const { data, error } = await supabase
          .from("parking_lots")
          .select("*")
          .order("name");

        if (error) throw error;

        console.log("Parking lots loaded:", data?.length || 0);
        setParkingLots(data || []);

        // Si hay estacionamientos y no hay uno seleccionado, seleccionamos el primero
        if (data && data.length > 0 && !selectedParkingLotId) {
          console.log("Setting default parking lot ID:", data[0].id);
          setSelectedParkingLotId(data[0].id);
        }
      } catch (err) {
        console.error("Error loading parking lots:", err);
        setError("Error al cargar los estacionamientos");
      } finally {
        setLoading(false);
      }
    };

    loadParkingLots();

    // Suscribirse a cambios en la tabla de estacionamientos
    const channel = supabase
      .channel("parking_lots_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "parking_lots" },
        () => {
          loadParkingLots();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Guardar el estacionamiento seleccionado en localStorage
  useEffect(() => {
    if (selectedParkingLotId) {
      localStorage.setItem("selectedParkingLotId", selectedParkingLotId);
      // Disparar evento para que otros componentes sepan que cambió el estacionamiento
      window.dispatchEvent(
        new CustomEvent("parking-lot-changed", {
          detail: selectedParkingLotId,
        }),
      );
    }
  }, [selectedParkingLotId]);

  return (
    <ParkingContext.Provider
      value={{
        selectedParkingLotId,
        setSelectedParkingLotId,
        parkingLots,
        loading,
        error,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error("useParking must be used within a ParkingProvider");
  }
  return context;
}
