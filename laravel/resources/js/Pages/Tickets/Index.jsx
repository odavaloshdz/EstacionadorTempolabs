import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    Car, 
    Search, 
    Calendar, 
    Clock, 
    Filter, 
    Download, 
    Printer, 
    X, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

export default function TicketsIndex() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showTicketDetails, setShowTicketDetails] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    // Generar datos de ejemplo para tickets
    useEffect(() => {
        const generateMockTickets = () => {
            const statuses = ['active', 'closed', 'cancelled'];
            const vehicleTypes = ['auto', 'moto', 'camioneta', 'otro'];
            
            return Array(50).fill().map((_, index) => {
                const isActive = Math.random() > 0.6;
                const entryTime = new Date(Date.now() - Math.random() * 86400000 * 5);
                const exitTime = isActive ? null : new Date(entryTime.getTime() + Math.random() * 86400000);
                const status = isActive ? 'active' : statuses[Math.floor(Math.random() * 2) + 1];
                const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
                const amount = !isActive ? Math.floor(Math.random() * 50) + 10 : null;
                
                return {
                    id: index + 1,
                    ticketNumber: `T-${String(index + 1001).padStart(4, '0')}`,
                    licensePlate: `ABC-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
                    entryTime: entryTime.toISOString(),
                    exitTime: exitTime?.toISOString() || null,
                    status,
                    vehicleType,
                    spaceId: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 10) + 1}`,
                    amount,
                    createdBy: 'admin@estacionador.com',
                    closedBy: !isActive ? 'admin@estacionador.com' : null,
                };
            });
        };

        const mockTickets = generateMockTickets();
        setTickets(mockTickets);
        setTotalPages(Math.ceil(mockTickets.length / 10));
        setLoading(false);
    }, []);

    // Filtrar y paginar tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = 
            ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.spaceId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        
        const matchesDateRange = () => {
            if (!dateRange.from && !dateRange.to) return true;
            
            const ticketDate = new Date(ticket.entryTime);
            const fromDate = dateRange.from ? new Date(dateRange.from) : null;
            const toDate = dateRange.to ? new Date(dateRange.to) : null;
            
            if (fromDate && toDate) {
                return ticketDate >= fromDate && ticketDate <= toDate;
            } else if (fromDate) {
                return ticketDate >= fromDate;
            } else if (toDate) {
                return ticketDate <= toDate;
            }
            
            return true;
        };
        
        return matchesSearch && matchesStatus && matchesDateRange();
    });

    const paginatedTickets = filteredTickets.slice((currentPage - 1) * 10, currentPage * 10);

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Manejar clic en ticket
    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDetails(true);
    };

    // Obtener color según estado
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Obtener texto según estado
    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'closed': return 'Cerrado';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    // Obtener icono según tipo de vehículo
    const getVehicleIcon = (type) => {
        return <Car className="h-4 w-4" />;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-800">
                    Gestión de Tickets
                </h2>
            }
        >
            <Head title="Tickets" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filtros y búsqueda */}
                            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar ticket, placa..."
                                            className="rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    
                                    <select
                                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="active">Activos</option>
                                        <option value="closed">Cerrados</option>
                                        <option value="cancelled">Cancelados</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                        />
                                        <span>a</span>
                                        <input
                                            type="date"
                                            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={dateRange.to}
                                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                        />
                                    </div>
                                    
                                    <button
                                        className="flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                        onClick={() => setDateRange({ from: '', to: '' })}
                                    >
                                        <Filter className="mr-1 h-4 w-4" />
                                        Limpiar
                                    </button>
                                    
                                    <button
                                        className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
                                    >
                                        <Download className="mr-1 h-4 w-4" />
                                        Exportar
                                    </button>
                                </div>
                            </div>
                            
                            {/* Tabla de tickets */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Ticket #
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Placa
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Entrada
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Salida
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Espacio
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Monto
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Cargando tickets...
                                                </td>
                                            </tr>
                                        ) : paginatedTickets.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No se encontraron tickets
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedTickets.map((ticket) => (
                                                <tr 
                                                    key={ticket.id} 
                                                    className="cursor-pointer hover:bg-gray-50"
                                                    onClick={() => handleTicketClick(ticket)}
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600">
                                                        {ticket.ticketNumber}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            {getVehicleIcon(ticket.vehicleType)}
                                                            <span className="ml-2">{ticket.licensePlate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {formatDate(ticket.entryTime)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {formatDate(ticket.exitTime)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {ticket.spaceId}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(ticket.status)}`}>
                                                            {getStatusText(ticket.status)}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {ticket.amount ? `$${ticket.amount}` : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Paginación */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> a <span className="font-medium">{Math.min(currentPage * 10, filteredTickets.length)}</span> de <span className="font-medium">{filteredTickets.length}</span> tickets
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de detalles de ticket */}
            {showTicketDetails && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-blue-900">Detalles del Ticket</h3>
                            <button
                                onClick={() => setShowTicketDetails(false)}
                                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6 rounded-md bg-blue-50 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-800">{selectedTicket.ticketNumber}</span>
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(selectedTicket.status)}`}>
                                    {getStatusText(selectedTicket.status)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Placa:</p>
                                    <p className="font-medium">{selectedTicket.licensePlate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Espacio:</p>
                                    <p className="font-medium">{selectedTicket.spaceId}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-6 grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700">Información de Tiempo</h4>
                                <div className="space-y-2 rounded-md bg-gray-50 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                            <span className="text-sm text-gray-600">Entrada:</span>
                                        </div>
                                        <span className="text-sm">{formatDate(selectedTicket.entryTime)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                            <span className="text-sm text-gray-600">Salida:</span>
                                        </div>
                                        <span className="text-sm">{formatDate(selectedTicket.exitTime)}</span>
                                    </div>
                                    {selectedTicket.exitTime && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-gray-600">Duración:</span>
                                            </div>
                                            <span className="text-sm">
                                                {Math.round((new Date(selectedTicket.exitTime) - new Date(selectedTicket.entryTime)) / (1000 * 60 * 60))} horas
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700">Información de Pago</h4>
                                <div className="space-y-2 rounded-md bg-gray-50 p-3">
                                    {selectedTicket.amount ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Monto:</span>
                                                <span className="text-lg font-bold text-blue-600">${selectedTicket.amount}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Método:</span>
                                                <span className="text-sm">Efectivo</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-2 text-center text-sm text-gray-500">
                                            No hay información de pago disponible
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <h4 className="mb-2 text-sm font-medium text-gray-700">Información Adicional</h4>
                            <div className="space-y-2 rounded-md bg-gray-50 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Creado por:</span>
                                    <span className="text-sm">{selectedTicket.createdBy}</span>
                                </div>
                                {selectedTicket.closedBy && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Cerrado por:</span>
                                        <span className="text-sm">{selectedTicket.closedBy}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Tipo de vehículo:</span>
                                    <span className="text-sm capitalize">{selectedTicket.vehicleType}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowTicketDetails(false)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Cerrar
                            </button>
                            <button
                                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
                                onClick={() => {
                                    // Lógica para imprimir ticket
                                    setShowTicketDetails(false);
                                }}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
} 