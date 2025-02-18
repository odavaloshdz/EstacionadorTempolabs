import React, { useState, useEffect } from "react";
import ParkingLotConstructor from "./ParkingLotConstructor";
import ActionPanel from "./ActionPanel";
import TicketModal from "./TicketModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

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
}

export default function Home() {
  const { user } = useAuth();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isEntryTicket, setIsEntryTicket] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [parkingData, setParkingData] = useState<ParkingData>({
    spaces: [],
    stats: { totalSpaces: 0, availableSpaces: 0, occupiedSpaces: 0 },
  });

  const loadParkingSpaces = async () => {
    const { data: spaces, error } = await supabase
      .from("parking_spaces")
      .select("*")
      .order("space_number");

    if (error) {
      console.error("Error loading parking spaces:", error);
      return;
    }

    if (spaces) {
      // Asegurarnos que los espacios se formateen correctamente
      const formattedSpaces = spaces.map((space) => {
        // Convertir explícitamente a booleano
        const isOccupied = space.is_occupied;
        return {
          id: space.space_number,
          isOccupied: isOccupied,
          vehicleType: space.vehicle_type || "auto",
        };
      });

      const occupiedCount = formattedSpaces.filter((s) => s.isOccupied).length;

      setParkingData({
        spaces: formattedSpaces,
        stats: {
          totalSpaces: formattedSpaces.length,
          availableSpaces: formattedSpaces.length - occupiedCount,
          occupiedSpaces: occupiedCount,
        },
      });
    }
  };

  useEffect(() => {
    loadParkingSpaces();

    const channel = supabase.channel("parking_spaces");

    // Suscribirse a cambios en tiempo real
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
  }, []);

  const handleSpaceClick = (spaceId: string) => {
    const space = parkingData.spaces.find((s) => s.id === spaceId);
    setSelectedSpace(spaceId);
    setIsEntryTicket(!space?.isOccupied);
    setShowTicketModal(true);
  };

  const handleTicketSubmit = async (ticketData: any) => {
    if (!selectedSpace) return;

    try {
      if (isEntryTicket) {
        // Primero actualizamos el espacio
        const { error: spaceError } = await supabase
          .from("parking_spaces")
          .update({
            is_occupied: true,
            vehicle_type: ticketData.vehicleInfo?.type || "auto",
            updated_at: new Date().toISOString(),
          })
          .eq("space_number", selectedSpace);

        if (spaceError) throw spaceError;

        const { error: ticketError } = await supabase.from("tickets").insert([
          {
            ticket_number: ticketData.ticketNumber,
            entry_time: new Date().toISOString(),
            plate_number: ticketData.licensePlate,
            parking_space_id: selectedSpace,
            status: "active",
            vehicle_type: ticketData.vehicleInfo?.type || "auto",
            created_by: user?.email,
          },
        ]);

        if (ticketError) throw ticketError;
      } else {
        // Actualizamos el espacio a desocupado
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
          .eq("parking_space_id", selectedSpace)
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
        .neq("space_number", "");

      if (error) throw error;

      await loadParkingSpaces();
    } catch (error) {
      console.error("Error emptying parking:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Panel de Acción Minimizado para Móvil */}
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

      {/* Contenido Principal */}
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

          <div className="h-[calc(100%-20px)] md:h-[calc(100%-100px)]">
            <ParkingLotConstructor
              spaces={parkingData.spaces}
              onSpaceClick={handleSpaceClick}
            />
          </div>
        </div>

        {/* Panel de Acción para Desktop */}
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
