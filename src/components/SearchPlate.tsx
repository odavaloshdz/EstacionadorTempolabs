import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Car } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SearchResult {
  licensePlate: string;
  parkingLotName: string;
  spotNumber: string;
  entryTime: string;
  status: string;
}

export default function SearchPlate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data: tickets, error: ticketsError } = await supabase
        .from("tickets")
        .select(
          `
          ticket_number,
          plate_number,
          spot_number,
          entry_time,
          status,
          parking_lot_id,
          parking_lots(name)
        `,
        )
        .eq("plate_number", searchQuery.toUpperCase())
        .eq("status", "active");

      if (ticketsError) throw ticketsError;

      if (tickets && tickets.length > 0) {
        const formattedResults = tickets.map((ticket) => ({
          licensePlate: ticket.plate_number,
          parkingLotName: ticket.parking_lots?.name || "Desconocido",
          spotNumber: ticket.spot_number || "N/A",
          entryTime: new Date(ticket.entry_time).toLocaleString(),
          status: ticket.status === "active" ? "Activo" : "Cerrado",
        }));

        setResults(formattedResults);
      } else {
        setResults([]);
        setError("No se encontraron vehículos con esa placa");
      }
    } catch (error) {
      console.error("Error searching plate:", error);
      setError("Error al buscar la placa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Buscador de Placas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Ingrese placa a buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Resultados:</h3>
            {results.map((result, index) => (
              <Card key={index} className="p-4 bg-slate-50">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Placa:</p>
                    <p className="text-lg">{result.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estacionamiento:</p>
                    <p>{result.parkingLotName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Espacio:</p>
                    <p>{result.spotNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Entrada:</p>
                    <p>{result.entryTime}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
