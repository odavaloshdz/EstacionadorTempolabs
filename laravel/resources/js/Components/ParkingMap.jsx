import React, { useState, useEffect } from "react";
import ParkingSpace from "./ParkingSpace";

export default function ParkingMap({
    spaces = [],
    onSpaceClick = () => {},
    selectedSpace = null,
}) {
    const [zoom, setZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Espacios por página - aumentado para mostrar más espacios
    const SPACES_PER_PAGE = isFullscreen ? 120 : 80;
    
    // Obtener los espacios para la página actual
    const getCurrentPageSpaces = () => {
        const start = (currentPage - 1) * SPACES_PER_PAGE;
        const end = start + SPACES_PER_PAGE;
        return spaces.slice(start, end);
    };
    
    // Calcular el número total de páginas
    const totalPages = Math.ceil(spaces.length / SPACES_PER_PAGE);
    
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 2));
    };
    
    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 0.5));
    };

    // Detectar cambios en el modo pantalla completa
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
    
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow h-full">
            <div className="border-b border-gray-200 bg-blue-50 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-blue-900">Mapa de Estacionamiento</h3>
            </div>
            <div className="p-4 h-[calc(100%-70px)]">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        <button
                            onClick={handleZoomOut}
                            className="rounded-md bg-gray-200 p-1 text-gray-600 hover:bg-gray-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={handleZoomIn}
                            className="rounded-md bg-gray-200 p-1 text-gray-600 hover:bg-gray-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`rounded-md p-1 ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <span className="text-sm text-gray-600">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`rounded-md p-1 ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md bg-blue-800 p-4 h-[calc(100%-60px)] overflow-y-auto">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-bold text-white">Estacionamiento Central</div>
                        <div className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                            {spaces.filter(space => !space.isOccupied).length} espacios disponibles
                        </div>
                    </div>
                    <div 
                        className={`grid gap-2 min-h-[500px] ${isFullscreen ? 'grid-cols-12' : 'grid-cols-10'}`}
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.3s ease' }}
                    >
                        {getCurrentPageSpaces().map((space) => (
                            <ParkingSpace
                                key={space.id}
                                spaceId={space.id}
                                isOccupied={space.isOccupied}
                                vehicleType={space.vehicleType}
                                spaceType={space.spaceType}
                                isSelected={selectedSpace === space.id}
                                onClick={onSpaceClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 