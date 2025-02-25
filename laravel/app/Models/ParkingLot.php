<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParkingLot extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'slug',
        'description',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'latitude',
        'longitude',
        'total_spaces',
        'available_spaces',
        'is_active',
        'opening_time',
        'closing_time',
        'business_hours',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'total_spaces' => 'integer',
        'available_spaces' => 'integer',
        'is_active' => 'boolean',
        'business_hours' => 'array',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];

    /**
     * Obtener la empresa asociada a este estacionamiento.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Obtener los espacios de estacionamiento asociados a este estacionamiento.
     */
    public function parkingSpaces(): HasMany
    {
        return $this->hasMany(ParkingSpace::class);
    }

    /**
     * Obtener los tickets asociados a este estacionamiento.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Obtener los espacios disponibles en este estacionamiento.
     */
    public function availableSpaces()
    {
        return $this->parkingSpaces()->where('is_occupied', false)->where('is_active', true);
    }

    /**
     * Obtener los espacios ocupados en este estacionamiento.
     */
    public function occupiedSpaces()
    {
        return $this->parkingSpaces()->where('is_occupied', true);
    }

    /**
     * Actualizar el contador de espacios disponibles.
     */
    public function updateAvailableSpaces(): void
    {
        $this->available_spaces = $this->availableSpaces()->count();
        $this->save();
    }
}
