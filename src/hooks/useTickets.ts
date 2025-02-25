import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { VehicleType } from "@/types/parking";
import { useAuth } from "@/contexts/AuthContext";

interface TicketData {
  ticketNumber: string;
  entryTime: string;
  licensePlate: string;
  exitTime?: string;
  duration?: string;
  amount?: number;
  vehicleInfo?: {
    type: VehicleType;
  };
}

export function useTickets(onTicketProcessed: () => Promise<void>) {
  const { user } = useAuth();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isEntryTicket, setIsEntryTicket] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  const handleSpaceClick = useCallback(async (spaceId: string, spaces: Array<{ id: string; isOccupied: boolean }>) => {
    try {
      const space = spaces.find((s) => s.id === spaceId);
      if (!space) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Space ${spaceId} not found`,
        });
        return;
      }
      
      setSelectedSpace(spaceId);
      setIsEntryTicket(!space.isOccupied);
      setShowTicketModal(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select parking space",
      });
    }
  }, []);

  const handleTicketSubmit = useCallback(async (ticketData: TicketData) => {
    if (!selectedSpace || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a space and sign in",
      });
      return;
    }

    try {
      if (isEntryTicket) {
        const { error: ticketError } = await supabase.from("tickets").insert({
          ticket_number: ticketData.ticketNumber,
          entry_time: new Date().toISOString(),
          plate_number: ticketData.licensePlate,
          spot_number: selectedSpace,
          status: "active",
          vehicle_type: ticketData.vehicleInfo?.type || "auto",
          created_by: user.email,
          parking_lot_id: "00000000-0000-0000-0000-000000000000",
        });

        if (ticketError) throw ticketError;

        const { error: spaceError } = await supabase
          .from("parking_spaces")
          .update({
            is_occupied: true,
            vehicle_type: ticketData.vehicleInfo?.type || "auto",
            updated_at: new Date().toISOString(),
          })
          .eq("space_number", selectedSpace);

        if (spaceError) throw spaceError;
      } else {
        const { data: activeTicket, error: ticketCheckError } = await supabase
          .from("tickets")
          .select("*")
          .eq("spot_number", selectedSpace)
          .eq("status", "active")
          .single();

        if (ticketCheckError || !activeTicket) {
          throw new Error('No se encontró un ticket activo para este espacio');
        }

        const { error: ticketError } = await supabase
          .from("tickets")
          .update({
            exit_time: new Date().toISOString(),
            status: "closed",
            amount: ticketData.amount || 10,
          })
          .eq("id", activeTicket.id);

        if (ticketError) throw ticketError;

        const { error: spaceError } = await supabase
          .from("parking_spaces")
          .update({
            is_occupied: false,
            vehicle_type: null,
            updated_at: new Date().toISOString(),
          })
          .eq("space_number", selectedSpace);

        if (spaceError) throw spaceError;
      }

      setShowTicketModal(false);
      await onTicketProcessed();
    } catch (error) {
      console.error("Error processing ticket:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al procesar el ticket'
      });
      await onTicketProcessed();
    }
  }, [isEntryTicket, onTicketProcessed, selectedSpace, user]);

  const openEntryTicketModal = useCallback(() => {
    setIsEntryTicket(true);
    setShowTicketModal(true);
  }, []);

  const openExitTicketModal = useCallback(() => {
    setIsEntryTicket(false);
    setShowTicketModal(true);
  }, []);

  const closeTicketModal = useCallback(() => {
    setShowTicketModal(false);
  }, []);

  return {
    showTicketModal,
    isEntryTicket,
    selectedSpace,
    handleSpaceClick,
    handleTicketSubmit,
    openEntryTicketModal,
    openExitTicketModal,
    closeTicketModal
  };
} 