import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Car } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SearchResult {
  id: string;
  ticketNumber: string;
  plateNumber: string;
  entryTime: string;
  spotNumber: string;
  parkingLotName: string;
}

export default function SearchPlate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar tickets activos con esa placa
      const { data: tickets, error: ticketsError } = await supabase
        .from("tickets")
        .select(
          `
          id,
          ticket_number,
          plate_number,
          entry_time,
          spot_number,
          parking_lot_id,
          parking_lots(name)
        `,
        )
        .eq("status", "active")
        .ilike("plate_number", `%${searchQuery.toUpperCase()}%`);

      if (ticketsError) throw ticketsError;

      if (tickets && tickets.length > 0) {
        const formattedResults = tickets.map((ticket: any) => ({
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          plateNumber: ticket.plate_number,
          entryTime: new Date(ticket.entry_time).toLocaleString(),
          spotNumber: ticket.spot_number,
          parkingLotName: ticket.parking_lots?.name || "Desconocido",
        }));

        setResults(formattedResults);
      } else {
        setResults([]);
      }
    } catch (error: any) {
      console.error("Error searching plate:", error);
      setError(error.message || "Error al buscar la placa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Placa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Ingrese la placa a buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {results.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Resultados ({results.length})
                </h3>
                <div className="space-y-3">
                  {results.map((result) => (
                    <Card key={result.id} className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Placa:</p>
                          <p className="font-semibold">{result.plateNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ticket:</p>
                          <p className="font-semibold">{result.ticketNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Espacio:</p>
                          <p className="font-semibold">{result.spotNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Entrada:</p>
                          <p className="font-semibold">{result.entryTime}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">
                            Estacionamiento:
                          </p>
                          <p className="font-semibold">
                            {result.parkingLotName}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : searchQuery && !loading ? (
              <p className="text-center py-4 text-gray-500">
                No se encontraron vehículos con esa placa
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
