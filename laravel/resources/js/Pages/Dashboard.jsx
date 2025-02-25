import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import ParkingMap from '@/Components/ParkingMap';
import ActionPanel from '@/Components/ActionPanel';
import ActivityList from '@/Components/ActivityList';
import { X, Printer, Save, Maximize, Minimize, ChevronUp, ChevronDown } from 'lucide-react';

export default function Dashboard({ auth }) {
    // Estado para el estacionamiento
    const [parkingData, setParkingData] = useState({
        stats: {
            totalSpaces: 120,
            occupiedSpaces: 78,
            availableSpaces: 42,
            todaysIncome: '$1,250'
        },
        spaces: Array(120).fill().map((_, index) => ({
            id: `${String.fromCharCode(65 + Math.floor(index / 10))}${(index % 10) + 1}`,
            isOccupied: Math.random() > 0.35,
            vehicleType: ['auto', 'moto', 'camioneta', 'otro'][Math.floor(Math.random() * 4)],
            spaceType: ['regular', 'handicap', 'reserved', 'nonParking'][Math.floor(Math.random() * 4)]
        })),
        recentActivity: [
            { id: 1, plate: 'ABC-123', action: 'Ingreso', time: '10:25 AM', location: 'Entrada Principal' },
            { id: 2, plate: 'XYZ-789', action: 'Salida', time: '10:15 AM', location: 'Salida Sur' },
            { id: 3, plate: 'DEF-456', action: 'Ingreso', time: '09:45 AM', location: 'Entrada Norte' },
            { id: 4, plate: 'GHI-789', action: 'Salida', time: '09:30 AM', location: 'Salida Principal' },
            { id: 5, plate: 'JKL-012', action: 'Ingreso', time: '09:15 AM', location: 'Entrada Principal' },
        ]
    });

    // Estado para el espacio seleccionado y modales
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [ticketData, setTicketData] = useState({
        plate: '',
        vehicleType: 'auto',
        spaceId: '',
        entryTime: new Date(),
    });
    const ticketRef = useRef(null);

    // Estado para los paneles minimizables
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showActionPanel, setShowActionPanel] = useState(true);
    const [showActivityPanel, setShowActivityPanel] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const mapContainerRef = useRef(null);

    // Manejadores de eventos
    const handleSpaceClick = (spaceId) => {
        const space = parkingData.spaces.find(s => s.id === spaceId);
        
        if (space) {
            setSelectedSpace(spaceId);
            
            if (!space.isOccupied) {
                // Si el espacio está disponible, abrir modal para crear ticket
                setTicketData({
                    ...ticketData,
                    spaceId: spaceId,
                    entryTime: new Date(),
                });
                setShowTicketModal(true);
            } else {
                // Si el espacio está ocupado, abrir modal para procesar pago
                setShowPaymentModal(true);
            }
        }
    };

    const handleCreateTicket = () => {
        setTicketData({
            ...ticketData,
            spaceId: '',
            entryTime: new Date(),
        });
        setShowTicketModal(true);
    };

    const handleProcessPayment = () => {
        setShowPaymentModal(true);
    };

    const handleEmptyParking = () => {
        if (confirm('¿Está seguro que desea vaciar todo el estacionamiento?')) {
            const newSpaces = parkingData.spaces.map(space => ({
                ...space,
                isOccupied: false,
                vehicleType: null
            }));
            
            setParkingData({
                ...parkingData,
                spaces: newSpaces,
                stats: {
                    ...parkingData.stats,
                    occupiedSpaces: 0,
                    availableSpaces: parkingData.stats.totalSpaces
                }
            });
        }
    };

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        
        // Actualizar el espacio seleccionado como ocupado
        const updatedSpaces = parkingData.spaces.map(space => {
            if (space.id === ticketData.spaceId) {
                return {
                    ...space,
                    isOccupied: true,
                    vehicleType: ticketData.vehicleType
                };
            }
            return space;
        });
        
        // Actualizar estadísticas
        const occupiedSpaces = updatedSpaces.filter(space => space.isOccupied).length;
        const availableSpaces = parkingData.stats.totalSpaces - occupiedSpaces;
        
        // Agregar actividad reciente
        const newActivity = {
            id: Date.now(),
            plate: ticketData.plate,
            action: 'Ingreso',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: 'Entrada Principal'
        };
        
        setParkingData({
            ...parkingData,
            spaces: updatedSpaces,
            stats: {
                ...parkingData.stats,
                occupiedSpaces,
                availableSpaces
            },
            recentActivity: [newActivity, ...parkingData.recentActivity.slice(0, 4)]
        });
        
        // Imprimir ticket
        setTimeout(() => {
            if (ticketRef.current) {
                window.print();
            }
            setShowTicketModal(false);
        }, 500);
    };

    // Manejar el modo pantalla completa
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (mapContainerRef.current.requestFullscreen) {
                mapContainerRef.current.requestFullscreen();
            } else if (mapContainerRef.current.webkitRequestFullscreen) {
                mapContainerRef.current.webkitRequestFullscreen();
            } else if (mapContainerRef.current.msRequestFullscreen) {
                mapContainerRef.current.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    // Escuchar eventos de cambio de pantalla completa
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(
                document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.msFullscreenElement
            );
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Actualizar la hora cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            // Forzar actualización del componente
            setParkingData(prev => ({ ...prev }));
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-800">
                    Gestión de Estacionamiento
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-2">
                <div className="mx-auto max-w-full">
                    {/* Estadísticas - Minimizables */}
                    <div className="mb-2 rounded-lg bg-white shadow">
                        <div 
                            className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-blue-50 px-4 py-3"
                            onClick={() => setShowStats(!showStats)}
                        >
                            <h3 className="text-lg font-medium leading-6 text-blue-900">Estadísticas</h3>
                            <button className="rounded-full p-1 hover:bg-blue-100">
                                {showStats ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-blue-500" />}
                            </button>
                        </div>
                        
                        {showStats && (
                            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray-500">Espacios Totales</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{parkingData.stats.totalSpaces}</dd>
                                </div>
                                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray-500">Espacios Ocupados</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">{parkingData.stats.occupiedSpaces}</dd>
                                </div>
                                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray-500">Espacios Disponibles</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{parkingData.stats.availableSpaces}</dd>
                                </div>
                                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray-500">Ingresos Hoy</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{parkingData.stats.todaysIncome}</dd>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 h-[calc(100vh-240px)]" ref={mapContainerRef}>
                        {/* Mapa de Estacionamiento - Ahora a la izquierda */}
                        <div className={`relative h-full ${isFullscreen ? 'col-span-4' : 'lg:col-span-3'}`}>
                            <div className="absolute right-4 top-4 z-10 flex space-x-2">
                                <button
                                    onClick={toggleFullscreen}
                                    className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                                    title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                                >
                                    {isFullscreen ? 
                                        <Minimize className="h-5 w-5 text-blue-600" /> : 
                                        <Maximize className="h-5 w-5 text-blue-600" />
                                    }
                                </button>
                            </div>
                            <ParkingMap 
                                spaces={parkingData.spaces}
                                onSpaceClick={handleSpaceClick}
                                selectedSpace={selectedSpace}
                            />
                        </div>

                        {/* Panel lateral derecho con acciones y actividad reciente - Minimizables */}
                        <div className={`flex flex-col space-y-4 ${isFullscreen ? 'hidden' : 'lg:col-span-1'}`}>
                            {/* Panel de Acciones */}
                            <div className="rounded-lg bg-white shadow">
                                <div 
                                    className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-blue-50 px-4 py-3"
                                    onClick={() => setShowActionPanel(!showActionPanel)}
                                >
                                    <h3 className="text-lg font-medium leading-6 text-blue-900">Acciones</h3>
                                    <button className="rounded-full p-1 hover:bg-blue-100">
                                        {showActionPanel ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-blue-500" />}
                                    </button>
                                </div>
                                
                                {showActionPanel && (
                                    <div className="p-4">
                                        <ActionPanel 
                                            parkingStats={parkingData.stats}
                                            onCreateTicket={handleCreateTicket}
                                            onProcessPayment={handleProcessPayment}
                                            onEmptyParking={handleEmptyParking}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actividad Reciente */}
                            <div className="rounded-lg bg-white shadow flex-1">
                                <div 
                                    className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-blue-50 px-4 py-3"
                                    onClick={() => setShowActivityPanel(!showActivityPanel)}
                                >
                                    <h3 className="text-lg font-medium leading-6 text-blue-900">Actividad Reciente</h3>
                                    <button className="rounded-full p-1 hover:bg-blue-100">
                                        {showActivityPanel ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-blue-500" />}
                                    </button>
                                </div>
                                
                                {showActivityPanel && (
                                    <div className="p-4">
                                        <ActivityList activities={parkingData.recentActivity} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para crear ticket */}
            {showTicketModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-blue-900">Crear Ticket</h3>
                            <button
                                onClick={() => setShowTicketModal(false)}
                                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleTicketSubmit}>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Placa del Vehículo
                                </label>
                                <input
                                    type="text"
                                    value={ticketData.plate}
                                    onChange={(e) => setTicketData({ ...ticketData, plate: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="ABC-123"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Tipo de Vehículo
                                </label>
                                <select
                                    value={ticketData.vehicleType}
                                    onChange={(e) => setTicketData({ ...ticketData, vehicleType: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="auto">Automóvil</option>
                                    <option value="moto">Motocicleta</option>
                                    <option value="camioneta">Camioneta</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Espacio Asignado
                                </label>
                                <input
                                    type="text"
                                    value={ticketData.spaceId}
                                    onChange={(e) => setTicketData({ ...ticketData, spaceId: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="A1"
                                    required
                                />
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTicketModal(false)}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar e Imprimir
                                </button>
                            </div>
                        </form>
                        
                        {/* Ticket para imprimir (oculto) */}
                        <div className="hidden print:block" ref={ticketRef}>
                            <div className="mx-auto w-80 p-4 text-center">
                                <h2 className="mb-2 text-xl font-bold">ESTACIONADOR</h2>
                                <p className="mb-4 text-sm">Ticket de Estacionamiento</p>
                                
                                <div className="mb-4 border-t border-b border-gray-300 py-2">
                                    <p className="mb-1"><strong>Placa:</strong> {ticketData.plate}</p>
                                    <p className="mb-1"><strong>Espacio:</strong> {ticketData.spaceId}</p>
                                    <p className="mb-1">
                                        <strong>Entrada:</strong> {ticketData.entryTime.toLocaleString()}
                                    </p>
                                </div>
                                
                                <p className="text-xs">Conserve este ticket para su salida</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para procesar pago */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-blue-900">Procesar Pago</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Implementar formulario de pago aquí...
                            </p>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    // Aquí iría la lógica para procesar el pago
                                    setShowPaymentModal(false);
                                }}
                                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Procesar y Liberar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
