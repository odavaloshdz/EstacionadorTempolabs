<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ParkingSpace extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parking_lot_id',
        'space_number',
        'space_type',
        'is_occupied',
        'vehicle_type',
        'license_plate',
        'row',
        'column',
        'floor',
        'is_active',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_occupied' => 'boolean',
        'row' => 'integer',
        'column' => 'integer',
        'floor' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Obtener el estacionamiento asociado a este espacio.
     */
    public function parkingLot(): BelongsTo
    {
        return $this->belongsTo(ParkingLot::class);
    }

    /**
     * Obtener los tickets asociados a este espacio.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Obtener el ticket activo asociado a este espacio.
     */
    public function activeTicket(): HasOne
    {
        return $this->hasOne(Ticket::class)
            ->where('status', 'active')
            ->latest();
    }

    /**
     * Verificar si el espacio está disponible.
     */
    public function isAvailable(): bool
    {
        return !$this->is_occupied && $this->is_active && $this->space_type !== 'nonParking';
    }

    /**
     * Ocupar el espacio con un vehículo.
     */
    public function occupy(string $vehicleType, string $licensePlate): void
    {
        $this->update([
            'is_occupied' => true,
            'vehicle_type' => $vehicleType,
            'license_plate' => $licensePlate,
        ]);

        // Actualizar el contador de espacios disponibles en el estacionamiento
        $this->parkingLot->updateAvailableSpaces();
    }

    /**
     * Liberar el espacio.
     */
    public function release(): void
    {
        $this->update([
            'is_occupied' => false,
            'vehicle_type' => null,
            'license_plate' => null,
        ]);

        // Actualizar el contador de espacios disponibles en el estacionamiento
        $this->parkingLot->updateAvailableSpaces();
    }
}
