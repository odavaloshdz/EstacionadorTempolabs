import React, { useState, useEffect } from "react";
import ParkingLotConstructor from "./ParkingLotConstructor";
import ActionPanel from "./ActionPanel";
import TicketModal from "./TicketModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useParking } from "@/contexts/ParkingContext";

interface ParkingSpace {
  id: string;
  isOccupied: boolean;
  vehicleType?: "auto" | "moto" | "camioneta" | "camion" | "van";
}

interface ParkingData {
  spaces: ParkingSpace[];
  stats: {
    totalSpaces: number;
    availableSpaces: number;
    occupiedSpaces: number;
  };
  loading?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const { selectedParkingLotId } = useParking();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isEntryTicket, setIsEntryTicket] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [parkingData, setParkingData] = useState<ParkingData>({
    spaces: [],
    stats: { totalSpaces: 0, availableSpaces: 0, occupiedSpaces: 0 },
    loading: false,
  });

  const loadParkingSpaces = async () => {
    if (!selectedParkingLotId) return;

    console.log("Loading parking spaces for ID:", selectedParkingLotId);

    // Show loading state
    setParkingData((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      // Primero verificamos si hay espacios para este estacionamiento
      const { data: spaces, error } = await supabase
        .from("parking_spaces")
        .select("*")
        .eq("parking_lot_id", selectedParkingLotId)
        .order("space_number");

      console.log("Spaces found:", spaces?.length || 0, "Error:", error);

      // Si no hay espacios, creamos algunos por defecto
      if (!spaces || spaces.length === 0) {
        // Obtener la configuración del estacionamiento si existe
        const { data: settings, error: settingsError } = await supabase
          .from("parking_settings")
          .select("*")
          .eq("id", selectedParkingLotId)
          .single();

        console.log("Settings found:", settings, "Error:", settingsError);

        // Si no hay configuración, intentamos obtener datos del parking_lot directamente
        let totalSpaces = 150; // Default to 150 spaces
        if (!settings && settingsError) {
          const { data: parkingLot } = await supabase
            .from("parking_lots")
            .select("capacity")
            .eq("id", selectedParkingLotId)
            .single();

          if (parkingLot) {
            totalSpaces = parkingLot.capacity || 150;
          }
          console.log("Using parking lot capacity:", totalSpaces);
        } else if (settings) {
          totalSpaces = settings.total_spaces || 150;
          console.log("Using settings total_spaces:", totalSpaces);
        }

        // Ensure we have a reasonable number of spaces
        totalSpaces = Math.max(10, Math.min(500, totalSpaces));

        // Create spaces in batches to avoid payload size limits
        const batchSize = 100;
        const batches = Math.ceil(totalSpaces / batchSize);

        console.log(`Creating ${totalSpaces} spaces in ${batches} batches`);

        for (let batch = 0; batch < batches; batch++) {
          const start = batch * batchSize;
          const end = Math.min(start + batchSize, totalSpaces);
          const count = end - start;

          console.log(
            `Creating batch ${batch + 1}/${batches} with ${count} spaces`,
          );

          const batchSpaces = Array(count)
            .fill(null)
            .map((_, index) => ({
              space_number: `A${(start + index + 1).toString().padStart(3, "0")}`,
              is_occupied: false,
              vehicle_type: null,
              parking_lot_id: selectedParkingLotId,
            }));

          const { error: insertError } = await supabase
            .from("parking_spaces")
            .insert(batchSpaces);

          if (insertError) {
            console.error(`Error inserting batch ${batch + 1}:`, insertError);
          } else {
            console.log(`Successfully created batch ${batch + 1}`);
          }
        }

        console.log("All spaces created, reloading...");
        // Volver a cargar los espacios
        return loadParkingSpaces();
      }

      if (error) {
        console.error("Error loading parking spaces:", error);
        return;
      }

      if (spaces) {
        const formattedSpaces = spaces.map((space) => ({
          id: space.space_number,
          isOccupied: space.is_occupied || false,
          vehicleType: space.vehicle_type || "auto",
        }));

        const occupiedCount = formattedSpaces.filter(
          (s) => s.isOccupied,
        ).length;

        setParkingData({
          spaces: formattedSpaces,
          stats: {
            totalSpaces: formattedSpaces.length,
            availableSpaces: formattedSpaces.length - occupiedCount,
            occupiedSpaces: occupiedCount,
          },
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error in loadParkingSpaces:", error);
    }
  };

  useEffect(() => {
    if (selectedParkingLotId) {
      loadParkingSpaces();
    } else {
      // Si no hay estacionamiento seleccionado, mostrar espacios vacíos
      setParkingData({
        spaces: [],
        stats: { totalSpaces: 0, availableSpaces: 0, occupiedSpaces: 0 },
        loading: false,
      });
    }

    const channel = supabase.channel("parking_spaces");

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "parking_spaces",
        },
        () => {
          loadParkingSpaces();
        },
      )
      .subscribe();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        loadParkingSpaces();
      }
    });

    return () => {
      channel.unsubscribe();
      authSubscription.unsubscribe();
    };
  }, [selectedParkingLotId]);

  const handleSpaceClick = (spaceId: string) => {
    const space = parkingData.spaces.find((s) => s.id === spaceId);
    setSelectedSpace(spaceId);
    setIsEntryTicket(!space?.isOccupied);
    setShowTicketModal(true);
  };

  const handleTicketSubmit = async (ticketData: {
    ticketNumber: string;
    entryTime: string;
    exitTime?: string;
    licensePlate: string;
    billingType: string;
    vehicleInfo?: {
      type?: string;
      leaveKeys?: boolean;
    };
    notes?: string;
    promotionalRate?: number;
    amount?: number;
  }) => {
    if (!selectedSpace) return;

    try {
      if (isEntryTicket) {
        const { error: spaceError } = await supabase
          .from("parking_spaces")
          .update({
            is_occupied: true,
            vehicle_type: ticketData.vehicleInfo?.type || "auto",
            updated_at: new Date().toISOString(),
          })
          .eq("space_number", selectedSpace);

        if (spaceError) throw spaceError;

        if (!selectedParkingLotId) return;

        const { error: ticketError } = await supabase.from("tickets").insert({
          ticket_number: ticketData.ticketNumber,
          entry_time: new Date().toISOString(),
          plate_number: ticketData.licensePlate,
          spot_number: selectedSpace,
          status: "active",
          vehicle_type: ticketData.vehicleInfo?.type || "auto",
          created_by: user?.email || "system",
          parking_lot_id: selectedParkingLotId,
          notes: ticketData.notes,
          billing_type: ticketData.billingType,
          promotional_rate: ticketData.promotionalRate,
          leave_keys: ticketData.vehicleInfo?.leaveKeys || false,
        });

        if (ticketError) throw ticketError;
      } else {
        const { error: spaceError } = await supabase
          .from("parking_spaces")
          .update({
            is_occupied: false,
            vehicle_type: null,
            updated_at: new Date().toISOString(),
          })
          .eq("space_number", selectedSpace);

        if (spaceError) throw spaceError;

        const { error: ticketError } = await supabase
          .from("tickets")
          .update({
            exit_time: new Date().toISOString(),
            status: "closed",
            amount: ticketData.amount || 10,
          })
          .eq("spot_number", selectedSpace)
          .eq("status", "active");

        if (ticketError) throw ticketError;
      }

      setShowTicketModal(false);
      await loadParkingSpaces();
    } catch (error) {
      console.error("Error processing ticket:", error);
      await loadParkingSpaces();
    }
  };

  const handleEmptyParking = async () => {
    try {
      const { error } = await supabase
        .from("parking_spaces")
        .update({
          is_occupied: false,
          vehicle_type: null,
          updated_at: new Date().toISOString(),
        })
        .eq("parking_lot_id", selectedParkingLotId);

      if (error) throw error;

      await loadParkingSpaces();
    } catch (error) {
      console.error("Error emptying parking:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="md:hidden bg-white border-b p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="text-sm">
            Disponibles:{" "}
            <span className="text-green-600 font-bold">
              {parkingData.stats.availableSpaces}
            </span>
          </span>
          <span className="text-sm">
            Ocupados:{" "}
            <span className="text-red-600 font-bold">
              {parkingData.stats.occupiedSpaces}
            </span>
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsEntryTicket(true);
              setShowTicketModal(true);
            }}
            className="p-2 text-sm bg-primary text-white rounded-md"
          >
            + Ticket
          </button>
        </div>
      </div>

      <div className="flex-1 flex md:flex-row">
        <div className="flex-1 p-2 md:p-6 overflow-hidden">
          <div className="mb-2 md:mb-6 hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Estacionamiento
            </h1>
            <p className="text-gray-500">
              Administre sus espacios y tickets de estacionamiento
            </p>
          </div>

          <div className="h-[calc(100%-20px)] md:h-[calc(100%-100px)] relative">
            {parkingData.loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-600">Cargando espacios...</p>
                </div>
              </div>
            )}
            <ParkingLotConstructor
              spaces={parkingData.spaces}
              onSpaceClick={handleSpaceClick}
            />
          </div>
        </div>

        <div className="hidden md:block">
          <ActionPanel
            parkingStats={parkingData.stats}
            onEmptyParking={handleEmptyParking}
            onCreateTicket={() => {
              setIsEntryTicket(true);
              setShowTicketModal(true);
            }}
            onProcessPayment={() => {
              setIsEntryTicket(false);
              setShowTicketModal(true);
            }}
          />
        </div>
      </div>

      {showTicketModal && (
        <TicketModal
          open={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          isEntry={isEntryTicket}
          ticketData={{
            ticketNumber: `T-${Date.now()}`,
            entryTime: new Date().toLocaleString(),
            licensePlate: "",
            billingType: "hourly",
            parkingLotId: selectedParkingLotId || "",
            ...(isEntryTicket
              ? {}
              : {
                  exitTime: new Date().toLocaleString(),
                  duration: "2 hours",
                  amount: 10.0,
                }),
          }}
          onSubmit={handleTicketSubmit}
        />
      )}
    </div>
  );
}
