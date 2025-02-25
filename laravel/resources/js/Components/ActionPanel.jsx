import React from "react";
import { Car, CreditCard, Trash2, Clock, BarChart3 } from "lucide-react";

export default function ActionPanel({
    parkingStats = {},
    onCreateTicket = () => {},
    onProcessPayment = () => {},
    onEmptyParking = () => {},
}) {
    const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div className="flex flex-col space-y-4">
            {/* Hora actual */}
            <div className="flex items-center justify-between rounded-md bg-blue-50 p-3">
                <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Hora Actual</span>
                </div>
                <span className="text-sm font-bold text-blue-900">{currentTime}</span>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onCreateTicket}
                    className="flex flex-col items-center justify-center rounded-md bg-blue-600 p-3 text-white shadow-sm hover:bg-blue-500"
                >
                    <Car className="mb-1 h-6 w-6" />
                    <span className="text-xs font-medium">Crear Ticket</span>
                </button>
                
                <button
                    onClick={onProcessPayment}
                    className="flex flex-col items-center justify-center rounded-md bg-green-600 p-3 text-white shadow-sm hover:bg-green-500"
                >
                    <CreditCard className="mb-1 h-6 w-6" />
                    <span className="text-xs font-medium">Procesar Pago</span>
                </button>
                
                <button
                    onClick={() => window.location.href = '/reports'}
                    className="flex flex-col items-center justify-center rounded-md bg-purple-600 p-3 text-white shadow-sm hover:bg-purple-500"
                >
                    <BarChart3 className="mb-1 h-6 w-6" />
                    <span className="text-xs font-medium">Reportes</span>
                </button>
                
                <button
                    onClick={onEmptyParking}
                    className="flex flex-col items-center justify-center rounded-md bg-red-600 p-3 text-white shadow-sm hover:bg-red-500"
                >
                    <Trash2 className="mb-1 h-6 w-6" />
                    <span className="text-xs font-medium">Vaciar</span>
                </button>
            </div>

            {/* Resumen de ocupación */}
            <div className="mt-2 rounded-md bg-gray-50 p-3">
                <div className="mb-2 text-sm font-medium text-gray-700">Ocupación</div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                            width: `${parkingStats.totalSpaces ? (parkingStats.occupiedSpaces / parkingStats.totalSpaces) * 100 : 0}%`,
                        }}
                    ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{parkingStats.occupiedSpaces} ocupados</span>
                    <span>{parkingStats.availableSpaces} disponibles</span>
                </div>
            </div>
        </div>
    );
} 