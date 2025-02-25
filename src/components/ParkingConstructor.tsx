import React, { useState, useEffect } from 'react';
import { Settings, Save, Edit, Plus, Trash2, User, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SpotType {
  name: string;
  color: string;
  rate: number;
}

interface Role {
  name: string;
  color: string;
  permissions: string[];
}

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface ParkingSpot {
  id: string;
  type: string;
  occupied: boolean;
  label: string;
  ticketId: string | null;
}

interface Ticket {
  id: string;
  spotId: string;
  spotLabel: string;
  spotType: string;
  entryTime: Date;
  exitTime: Date | null;
  status: 'active' | 'closed';
  createdBy: {
    id: number;
    name: string;
    role: string;
  };
  closedBy: {
    id: number;
    name: string;
    role: string;
  } | null;
  rate: number;
  amount: number;
}

const ParkingConstructor: React.FC = () => {
  const { user } = useAuth();
  const [parkingLayout, setParkingLayout] = useState<ParkingSpot[][]>([]);
  const [rows, setRows] = useState(6);
  const [columns, setColumns] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<{ row: number; col: number } | null>(null);
  const [ticketModal, setTicketModal] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const [spotTypes] = useState<Record<string, SpotType>>({
    'regular': { name: 'Regular', color: 'bg-blue-500', rate: 20 },
    'handicap': { name: 'Discapacitados', color: 'bg-purple-500', rate: 15 },
    'reserved': { name: 'Reservado', color: 'bg-yellow-500', rate: 30 },
    'nonParking': { name: 'No Estacionable', color: 'bg-gray-500', rate: 0 },
  });

  const roles: Record<string, Role> = {
    'admin': { name: 'Administrador', color: 'bg-red-500', permissions: ['manage_layout', 'manage_users', 'manage_tickets', 'view_reports'] },
    'manager': { name: 'Gerente', color: 'bg-blue-500', permissions: ['manage_tickets', 'view_reports'] },
    'employee': { name: 'Empleado', color: 'bg-green-500', permissions: ['manage_tickets'] }
  };

  useEffect(() => {
    const loadInitialLayout = async () => {
      try {
        const { data: spaces, error } = await supabase
          .from('parking_spaces')
          .select('*')
          .order('space_number');

        if (error) throw error;

        if (spaces && spaces.length > 0) {
          // Convert database data to our layout format
          const maxRow = Math.max(...spaces.map(s => parseInt(s.space_number.split('-')[0])));
          const maxCol = Math.max(...spaces.map(s => parseInt(s.space_number.split('-')[1])));
          
          setRows(maxRow + 1);
          setColumns(maxCol + 1);

          const newLayout = Array(maxRow + 1).fill(null).map(() =>
            Array(maxCol + 1).fill(null).map(() => ({
              id: '',
              type: 'regular',
              occupied: false,
              label: '',
              ticketId: null
            }))
          );

          spaces.forEach(space => {
            const [row, col] = space.space_number.split('-').map(Number);
            newLayout[row][col] = {
              id: space.space_number,
              type: space.type || 'regular',
              occupied: space.is_occupied,
              label: space.label || '',
              ticketId: space.ticket_id
            };
          });

          setParkingLayout(newLayout);
        } else {
          // Initialize empty layout if no spaces exist
          const initialLayout = Array(rows).fill(null).map(() => 
            Array(columns).fill(null).map(() => ({
              id: '',
              type: 'regular',
              occupied: false,
              label: '',
              ticketId: null
            }))
          );
          setParkingLayout(initialLayout);
        }
      } catch (error) {
        console.error('Error loading parking layout:', error);
      }
    };

    loadInitialLayout();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userRole = roles[user.role];
    return userRole ? userRole.permissions.includes(permission) : false;
  };

  const handleSpotSelect = (rowIndex: number, colIndex: number) => {
    if (!isEditing) return;
    setSelectedSpot({ row: rowIndex, col: colIndex });
  };

  const changeSpotType = async (type: string) => {
    if (!selectedSpot || !hasPermission('manage_layout')) return;
    
    try {
      const spaceNumber = `${selectedSpot.row}-${selectedSpot.col}`;
      const { error } = await supabase
        .from('parking_spaces')
        .upsert({
          space_number: spaceNumber,
          type: type,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      const newLayout = [...parkingLayout];
      newLayout[selectedSpot.row][selectedSpot.col].type = type;
      setParkingLayout(newLayout);
    } catch (error) {
      console.error('Error updating spot type:', error);
    }
  };

  const updateSpotLabel = async (label: string) => {
    if (!selectedSpot || !hasPermission('manage_layout')) return;
    
    try {
      const spaceNumber = `${selectedSpot.row}-${selectedSpot.col}`;
      const { error } = await supabase
        .from('parking_spaces')
        .upsert({
          space_number: spaceNumber,
          label: label,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      const newLayout = [...parkingLayout];
      newLayout[selectedSpot.row][selectedSpot.col].label = label;
      setParkingLayout(newLayout);
    } catch (error) {
      console.error('Error updating spot label:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Gestión de Estacionamiento</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-md ${isEditing ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            disabled={!hasPermission('manage_layout')}
          >
            <Edit size={20} />
          </button>
          <button 
            className="p-2 bg-gray-200 rounded-md"
            disabled={!hasPermission('manage_layout')}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid gap-2 overflow-auto p-4" 
           style={{ 
             gridTemplateColumns: `repeat(${columns}, minmax(60px, 1fr))`,
             minWidth: `${columns * 70}px`
           }}>
        {parkingLayout.map((row, rowIndex) => 
          row.map((spot, colIndex) => {
            const isSelected = selectedSpot?.row === rowIndex && selectedSpot?.col === colIndex;
            const spotTypeStyle = spotTypes[spot.type]?.color || 'bg-blue-500';
            const finalStyle = spot.type === 'nonParking' ? spotTypeStyle : (spot.occupied ? 'bg-red-500' : 'bg-green-500');

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSpotSelect(rowIndex, colIndex)}
                className={`
                  w-full aspect-square flex items-center justify-center rounded-md cursor-pointer
                  transition-all ${finalStyle} ${isSelected ? 'ring-4 ring-blue-300' : ''}
                `}
              >
                <span className="text-white font-medium">
                  {spot.label || `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
                </span>
              </div>
            );
          })
        )}
      </div>

      {isEditing && selectedSpot && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h2 className="font-bold mb-2">Editar Espacio</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-sm mb-1">Tipo de Espacio:</p>
              <div className="flex gap-2">
                {Object.entries(spotTypes).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => changeSpotType(key)}
                    className={`p-2 rounded-md ${type.color} text-white text-xs`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-1">Etiqueta:</p>
              <input
                type="text"
                value={parkingLayout[selectedSpot.row][selectedSpot.col].label}
                onChange={(e) => updateSpotLabel(e.target.value)}
                className="border p-1 rounded"
                placeholder="A1, B2, etc."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingConstructor;