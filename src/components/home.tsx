import React, { useState } from "react";
import ParkingLotConstructor from "./ParkingLotConstructor";
import ActionPanel from "./ActionPanel";
import TicketModal from "./TicketModal";

interface HomeProps {
  initialParkingData?: {
    spaces: Array<{
      id: string;
      isOccupied: boolean;
    }>;
    stats: {
      totalSpaces: number;
      availableSpaces: number;
      occupiedSpaces: number;
    };
  };
}

export default function Home({
  initialParkingData = {
    spaces: Array(12)
      .fill(null)
      .map((_, index) => ({
        id: `A${index + 1}`,
        isOccupied: Math.random() > 0.5,
      })),
    stats: {
      totalSpaces: 12,
      availableSpaces: 7,
      occupiedSpaces: 5,
    },
  },
}: HomeProps) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isEntryTicket, setIsEntryTicket] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  const handleSpaceClick = (spaceId: string) => {
    setSelectedSpace(spaceId);
    setShowTicketModal(true);
    // If space is occupied, show exit ticket modal, otherwise show entry ticket modal
    const space = initialParkingData.spaces.find((s) => s.id === spaceId);
    setIsEntryTicket(!space?.isOccupied);
  };

  const handleCreateTicket = () => {
    setIsEntryTicket(true);
    setShowTicketModal(true);
  };

  const handleProcessPayment = () => {
    setIsEntryTicket(false);
    setShowTicketModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="flex-1 p-6 overflow-hidden">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Estacionamiento
          </h1>
          <p className="text-gray-500">
            Administre sus espacios y tickets de estacionamiento
          </p>
        </div>

        <div className="h-[calc(100%-100px)]">
          <ParkingLotConstructor
            spaces={initialParkingData.spaces}
            onSpaceClick={handleSpaceClick}
          />
        </div>
      </div>

      <ActionPanel
        parkingStats={initialParkingData.stats}
        onCreateTicket={handleCreateTicket}
        onProcessPayment={handleProcessPayment}
      />

      <TicketModal
        open={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        isEntry={isEntryTicket}
        ticketData={{
          ticketNumber: `T-${selectedSpace || "001"}`,
          entryTime: new Date().toLocaleString(),
          licensePlate: "ABC-123",
          ...(isEntryTicket
            ? {}
            : {
                exitTime: new Date().toLocaleString(),
                duration: "2 hours",
                amount: 10.0,
              }),
        }}
      />
    </div>
  );
};

export default Home;
