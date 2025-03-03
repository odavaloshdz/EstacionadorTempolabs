import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePermissions } from "@/hooks/usePermissions";

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  capacity: number;
  hourly_rate: number;
  status: string;
  company_id: string;
  created_at: string;
}

export default function ParkingLotsPage() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] =
    useState<ParkingLot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: 50,
    hourly_rate: 10,
  });
  const { toast } = useToast();
  const { hasPermission } = usePermissions();

  const loadParkingLots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("parking_lots")
        .select("*")
        .order("name");

      if (error) throw error;

      setParkingLots(data || []);
    } catch (error) {
      console.error("Error loading parking lots:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los estacionamientos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, []);

  const handleCreateParkingLot = async () => {
    try {
      // Obtener la empresa del usuario actual
      const { data: companyUser, error: companyUserError } = await supabase
        .from("company_users")
        .select("company_id")
        .single();

      if (companyUserError) throw companyUserError;

      const { data, error } = await supabase.from("parking_lots").insert([
        {
          name: formData.name,
          address: formData.address,
          capacity: formData.capacity,
          hourly_rate: formData.hourly_rate,
          company_id: companyUser.company_id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Estacionamiento creado",
        description: "El estacionamiento ha sido creado exitosamente",
      });

      setShowForm(false);
      await loadParkingLots();
    } catch (error: any) {
      console.error("Error creating parking lot:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el estacionamiento",
        variant: "destructive",
      });
    }
  };

  const handleUpdateParkingLot = async () => {
    if (!selectedParkingLot) return;

    try {
      const { error } = await supabase
        .from("parking_lots")
        .update({
          name: formData.name,
          address: formData.address,
          capacity: formData.capacity,
          hourly_rate: formData.hourly_rate,
        })
        .eq("id", selectedParkingLot.id);

      if (error) throw error;

      toast({
        title: "Estacionamiento actualizado",
        description: "Los cambios han sido guardados exitosamente",
      });

      setShowForm(false);
      await loadParkingLots();
    } catch (error: any) {
      console.error("Error updating parking lot:", error);
      toast({
        title: "Error",
        description:
          error.message || "No se pudo actualizar el estacionamiento",
        variant: "destructive",
      });
    }
  };

  const handleDeleteParkingLot = async () => {
    if (!selectedParkingLot) return;

    try {
      // Primero verificamos si hay tickets activos
      const { data: activeTickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("id")
        .eq("parking_lot_id", selectedParkingLot.id)
        .eq("status", "active");

      if (ticketsError) throw ticketsError;

      if (activeTickets && activeTickets.length > 0) {
        throw new Error(
          "No se puede eliminar un estacionamiento con tickets activos",
        );
      }

      const { error } = await supabase
        .from("parking_lots")
        .delete()
        .eq("id", selectedParkingLot.id);

      if (error) throw error;

      toast({
        title: "Estacionamiento eliminado",
        description: "El estacionamiento ha sido eliminado exitosamente",
      });

      setShowDeleteDialog(false);
      setSelectedParkingLot(null);
      await loadParkingLots();
    } catch (error: any) {
      console.error("Error deleting parking lot:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el estacionamiento",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
    }
  };

  const openEditForm = (parkingLot: ParkingLot) => {
    setSelectedParkingLot(parkingLot);
    setFormData({
      name: parkingLot.name,
      address: parkingLot.address || "",
      capacity: parkingLot.capacity,
      hourly_rate: parkingLot.hourly_rate,
    });
    setShowForm(true);
  };

  const openCreateForm = () => {
    setSelectedParkingLot(null);
    setFormData({
      name: "",
      address: "",
      capacity: 50,
      hourly_rate: 10,
    });
    setShowForm(true);
  };

  if (!hasPermission("settings.view")) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          No tienes permisos para ver esta página
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Cargando estacionamientos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estacionamientos</h1>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Estacionamiento
        </Button>
      </div>

      {parkingLots.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No hay estacionamientos</h3>
          <p className="mt-1 text-gray-500">
            Comienza creando tu primer estacionamiento
          </p>
          <Button onClick={openCreateForm} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Estacionamiento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingLots.map((parkingLot) => (
            <Card key={parkingLot.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{parkingLot.name}</CardTitle>
                    <CardDescription>{parkingLot.address}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      parkingLot.status === "active" ? "success" : "destructive"
                    }
                  >
                    {parkingLot.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Capacidad:</span>
                    <span>{parkingLot.capacity} espacios</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Tarifa por hora:
                    </span>
                    <span>${parkingLot.hourly_rate.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditForm(parkingLot)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedParkingLot(parkingLot);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedParkingLot
                ? "Editar Estacionamiento"
                : "Nuevo Estacionamiento"}
            </DialogTitle>
            <DialogDescription>
              Complete los detalles del estacionamiento a continuación.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Estacionamiento Principal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Av. Principal #123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Tarifa por Hora ($)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourly_rate: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={
                selectedParkingLot
                  ? handleUpdateParkingLot
                  : handleCreateParkingLot
              }
            >
              {selectedParkingLot ? "Guardar Cambios" : "Crear Estacionamiento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              estacionamiento
              {selectedParkingLot && ` "${selectedParkingLot.name}"`} y todos
              sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteParkingLot}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
