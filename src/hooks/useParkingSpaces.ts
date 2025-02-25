import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { VehicleType } from "@/types/parking";
import { useNavigate } from "react-router-dom";

interface ParkingSpace {
  id: string;
  isOccupied: boolean;
  vehicleType?: VehicleType;
}

interface ParkingData {
  spaces: ParkingSpace[];
  stats: {
    totalSpaces: number;
    availableSpaces: number;
    occupiedSpaces: number;
  };
}

const initialParkingData = {
  spaces: [],
  stats: { totalSpaces: 0, availableSpaces: 0, occupiedSpaces: 0 },
};

export function useParkingSpaces() {
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState<ParkingData>(initialParkingData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadParkingSpaces = useCallback(async () => {
    try {
      console.log("Loading parking spaces...");
      setIsLoading(true);
      setLoadError(null);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        setLoadError("Error de autenticación. Por favor, inicia sesión nuevamente.");
        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: "Por favor, inicia sesión nuevamente.",
        });
        setParkingData(initialParkingData);
        return;
      }

      if (!session?.user) {
        console.warn('No session found');
        setLoadError("No estás autenticado. Por favor, inicia sesión.");
        toast({
          variant: "destructive",
          title: "No autenticado",
          description: "Por favor, inicia sesión para ver los espacios de estacionamiento.",
        });
        setParkingData(initialParkingData);
        return;
      }

      const { data: existingSpaces, error: checkError } = await supabase
        .from('parking_spaces')
        .select('count')
        .limit(1);
        
      if (checkError) {
        console.error('Error checking spaces:', checkError);
      } else if (!existingSpaces || existingSpaces.length === 0) {
        console.log('No parking spaces found, creating test spaces');
        
        const testSpaces = Array.from({ length: 20 }, (_, i) => ({
          space_number: `A${i + 1}`,
          is_occupied: false,
          vehicle_type: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        
        const { error: createError } = await supabase
          .from('parking_spaces')
          .insert(testSpaces);
          
        if (createError) {
          console.error('Error creating test spaces:', createError);
        }
      }

      const { data: spaces, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .order('space_number');

      if (error) {
        console.error('Database error:', error.message);
        setLoadError(`Error de base de datos: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Error de base de datos",
          description: error.message,
        });
        setParkingData(initialParkingData);
        return;
      }

      if (!spaces || spaces.length === 0) {
        console.warn('No parking spaces data received');
        setParkingData({
          spaces: [],
          stats: { totalSpaces: 0, availableSpaces: 0, occupiedSpaces: 0 },
        });
        return;
      }

      console.log(`Loaded ${spaces.length} parking spaces`);
      const formattedSpaces = spaces.map((space) => ({
        id: space.space_number,
        isOccupied: space.is_occupied || false,
        vehicleType: (space.vehicle_type || 'auto') as VehicleType,
      }));

      const occupiedCount = formattedSpaces.filter((s) => s.isOccupied).length;
      setParkingData({
        spaces: formattedSpaces,
        stats: {
          totalSpaces: formattedSpaces.length,
          availableSpaces: formattedSpaces.length - occupiedCount,
          occupiedSpaces: occupiedCount,
        },
      });
    } catch (error) {
      console.error('Error loading parking spaces:', error);
      setLoadError("Error al cargar los espacios de estacionamiento.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los espacios de estacionamiento. Por favor, intenta de nuevo.",
      });
      setParkingData(initialParkingData);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const setupSubscriptions = useCallback(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initializeSubscriptions = async () => {
      try {
        console.log("Initializing parking space subscriptions...");
        channel = supabase.channel('parking_spaces_changes');
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'parking_spaces',
            },
            () => {
              if (mounted) {
                console.log("Parking spaces changed, reloading data");
                loadParkingSpaces();
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to parking spaces changes');
            }
          });

        await loadParkingSpaces();
      } catch (error) {
        console.error('Error initializing subscriptions:', error);
        setLoadError("Error al inicializar las suscripciones.");
      }
    };

    initializeSubscriptions();

    return () => {
      console.log("Cleaning up parking space subscriptions");
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [loadParkingSpaces]);

  const emptyParking = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("parking_spaces")
        .update({
          is_occupied: false,
          vehicle_type: null,
          updated_at: new Date().toISOString(),
        })
        .neq("space_number", "");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to empty parking lot",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Parking lot has been emptied",
      });
      await loadParkingSpaces();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to empty parking lot",
      });
    }
  }, [loadParkingSpaces]);

  return {
    parkingData,
    isLoading,
    loadError,
    loadParkingSpaces,
    setupSubscriptions,
    emptyParking
  };
} 