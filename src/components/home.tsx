import React, { useEffect } from "react";
import TicketModal from "./TicketModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParkingSpaces } from "@/hooks/useParkingSpaces";
import { useTickets } from "@/hooks/useTickets";
import ParkingDisplay from "./ParkingDisplay";
import LoadingErrorDisplay from "./LoadingErrorDisplay";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Usar el hook personalizado para gestionar espacios de estacionamiento
  const {
    parkingData,
    isLoading,
    loadError,
    loadParkingSpaces,
    setupSubscriptions,
    emptyParking
  } = useParkingSpaces();
  
  // Usar el hook personalizado para gestionar tickets
  const {
    showTicketModal,
    isEntryTicket,
    selectedSpace,
    handleSpaceClick,
    handleTicketSubmit,
    openEntryTicketModal,
    openExitTicketModal,
    closeTicketModal
  } = useTickets(loadParkingSpaces);

  // Verificar autenticación
  useEffect(() => {
    console.log("Home component - auth state:", authLoading ? "loading" : "ready", user ? "user exists" : "no user");
    
    if (!authLoading && !user) {
      console.log("No authenticated user in Home, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Configurar suscripciones a cambios en la base de datos
  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    let cleanupParkingSubscription: (() => void) | null = null;
    
    const setupAuthSubscription = () => {
      console.log("Setting up auth subscription in Home");
      authSubscription = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed in Home component:", event);
        if (event === 'SIGNED_OUT') {
          console.log("User signed out, redirecting to login");
          navigate("/login", { replace: true });
        }
      }).data.subscription;
    };
    
    if (!authLoading) {
      console.log("Auth loading complete, initializing subscriptions");
      setupAuthSubscription();
      cleanupParkingSubscription = setupSubscriptions();
    }
    
    return () => {
      console.log("Cleaning up Home component");
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (cleanupParkingSubscription) {
        cleanupParkingSubscription();
      }
    };
  }, [authLoading, navigate, setupSubscriptions]);

  // Manejar clic en espacio de estacionamiento
  const onSpaceClick = (spaceId: string) => {
    handleSpaceClick(spaceId, parkingData.spaces);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <LoadingErrorDisplay 
        isLoading={isLoading} 
        error={loadError} 
        onRetry={loadParkingSpaces} 
      />
      
      {!isLoading && !loadError && (
        <ParkingDisplay 
          spaces={parkingData.spaces}
          stats={parkingData.stats}
          onSpaceClick={onSpaceClick}
          onEmptyParking={emptyParking}
          onCreateTicket={openEntryTicketModal}
          onProcessPayment={openExitTicketModal}
        />
      )}
      
      {showTicketModal && (
        <TicketModal
          open={showTicketModal}
          onClose={closeTicketModal}
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
