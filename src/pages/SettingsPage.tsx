import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CarFront, DollarSign, Hash } from "lucide-react";

const DEFAULT_SETTINGS_ID = "00000000-0000-0000-0000-000000000000";

export default function SettingsPage() {
  const [rates, setRates] = useState({
    auto: 10,
    moto: 5,
    camioneta: 15,
    camion: 20,
    van: 15,
  });

  const [parkingLot, setParkingLot] = useState({
    name: "Estacionamiento Central",
    totalSpaces: 50,
    rows: 5,
    columns: 10,
    capacityByType: {
      auto: 30,
      moto: 10,
      camioneta: 5,
      camion: 3,
      van: 2,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data: settings } = await supabase
        .from("parking_settings")
        .select("*")
        .eq("id", DEFAULT_SETTINGS_ID)
        .single();

      if (settings) {
        setRates({
          auto: settings.rate_auto || 10,
          moto: settings.rate_moto || 5,
          camioneta: settings.rate_camioneta || 15,
          camion: settings.rate_camion || 20,
          van: settings.rate_van || 15,
        });

        setParkingLot({
          name: settings.name || "Estacionamiento Central",
          totalSpaces: settings.total_spaces || 50,
          rows: settings.rows || 5,
          columns: settings.columns || 10,
          capacityByType: {
            auto: settings.capacity_auto || 30,
            moto: settings.capacity_moto || 10,
            camioneta: settings.capacity_camioneta || 5,
            camion: settings.capacity_camion || 3,
            van: settings.capacity_van || 2,
          },
        });
      }
    };

    loadSettings();
  }, []);

  const handleSaveRates = async () => {
    try {
      const dataToUpdate = {
        rate_auto: rates.auto,
        rate_moto: rates.moto,
        rate_camioneta: rates.camioneta,
        rate_camion: rates.camion,
        rate_van: rates.van,
        name: parkingLot.name,
        total_spaces: parkingLot.totalSpaces,
        rows: parkingLot.rows,
        columns: parkingLot.columns,
        capacity_auto: parkingLot.capacityByType.auto,
        capacity_moto: parkingLot.capacityByType.moto,
        capacity_camioneta: parkingLot.capacityByType.camioneta,
        capacity_camion: parkingLot.capacityByType.camion,
        capacity_van: parkingLot.capacityByType.van,
      };

      const { error } = await supabase
        .from("parking_settings")
        .update(dataToUpdate)
        .eq("id", DEFAULT_SETTINGS_ID);

      if (error) throw error;
      alert("Tarifas guardadas exitosamente");
    } catch (error) {
      console.error("Error saving rates:", error);
      alert("Error al guardar las tarifas");
    }
  };

  const handleSaveParkingLot = async () => {
    try {
      const dataToUpdate = {
        name: parkingLot.name,
        total_spaces: parkingLot.totalSpaces,
        rows: parkingLot.rows,
        columns: parkingLot.columns,
        capacity_auto: parkingLot.capacityByType.auto,
        capacity_moto: parkingLot.capacityByType.moto,
        capacity_camioneta: parkingLot.capacityByType.camioneta,
        capacity_camion: parkingLot.capacityByType.camion,
        capacity_van: parkingLot.capacityByType.van,
        rate_auto: rates.auto,
        rate_moto: rates.moto,
        rate_camioneta: rates.camioneta,
        rate_camion: rates.camion,
        rate_van: rates.van,
      };

      const { error } = await supabase
        .from("parking_settings")
        .update(dataToUpdate)
        .eq("id", DEFAULT_SETTINGS_ID);

      if (error) throw error;

      // Actualizar espacios de estacionamiento
      const { error: spacesError } = await supabase
        .from("parking_spaces")
        .delete()
        .neq("id", "dummy");

      if (spacesError) throw spacesError;

      const newSpaces = Array(parkingLot.totalSpaces)
        .fill(null)
        .map((_, index) => ({
          space_number: `A${(index + 1).toString().padStart(3, "0")}`,
          is_occupied: false,
        }));

      const { error: insertError } = await supabase
        .from("parking_spaces")
        .insert(newSpaces);

      if (insertError) throw insertError;

      alert("Configuración guardada exitosamente");
    } catch (error) {
      console.error("Error saving parking lot settings:", error);
      alert("Error al guardar la configuración");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Administre la configuración del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tarifas por Hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(rates).map(([vehicle, rate]) => (
              <div key={vehicle} className="space-y-2">
                <Label htmlFor={vehicle}>
                  {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                </Label>
                <div className="flex items-center space-x-2">
                  <CarFront className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id={vehicle}
                    type="number"
                    value={rate}
                    onChange={(e) =>
                      setRates({ ...rates, [vehicle]: Number(e.target.value) })
                    }
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleSaveRates} className="mt-4">
            Guardar Tarifas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Configuración del Estacionamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parkingName">Nombre del Estacionamiento</Label>
              <Input
                id="parkingName"
                value={parkingLot.name}
                onChange={(e) =>
                  setParkingLot({ ...parkingLot, name: e.target.value })
                }
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Capacidad por Tipo de Vehículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parkingLot.capacityByType).map(
                  ([type, capacity]) => (
                    <div key={type} className="space-y-2">
                      <Label htmlFor={`capacity-${type}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Label>
                      <Input
                        id={`capacity-${type}`}
                        type="number"
                        value={capacity}
                        onChange={(e) =>
                          setParkingLot({
                            ...parkingLot,
                            capacityByType: {
                              ...parkingLot.capacityByType,
                              [type]: Number(e.target.value),
                            },
                          })
                        }
                        min="0"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalSpaces">Espacios Totales</Label>
                <Input
                  id="totalSpaces"
                  type="number"
                  value={parkingLot.totalSpaces}
                  onChange={(e) =>
                    setParkingLot({
                      ...parkingLot,
                      totalSpaces: Number(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rows">Filas</Label>
                <Input
                  id="rows"
                  type="number"
                  value={parkingLot.rows}
                  onChange={(e) =>
                    setParkingLot({
                      ...parkingLot,
                      rows: Number(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="columns">Columnas</Label>
                <Input
                  id="columns"
                  type="number"
                  value={parkingLot.columns}
                  onChange={(e) =>
                    setParkingLot({
                      ...parkingLot,
                      columns: Number(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>
            </div>

            <Button onClick={handleSaveParkingLot} className="mt-4">
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
