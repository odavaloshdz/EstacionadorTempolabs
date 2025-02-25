<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parking_lot_id',
        'parking_space_id',
        'created_by',
        'closed_by',
        'ticket_number',
        'license_plate',
        'vehicle_type',
        'vehicle_color',
        'vehicle_model',
        'entry_time',
        'exit_time',
        'duration_minutes',
        'amount',
        'status',
        'notes',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'entry_time' => 'datetime',
        'exit_time' => 'datetime',
        'duration_minutes' => 'integer',
        'amount' => 'decimal:2',
    ];

    /**
     * Obtener el estacionamiento asociado a este ticket.
     */
    public function parkingLot(): BelongsTo
    {
        return $this->belongsTo(ParkingLot::class);
    }

    /**
     * Obtener el espacio de estacionamiento asociado a este ticket.
     */
    public function parkingSpace(): BelongsTo
    {
        return $this->belongsTo(ParkingSpace::class);
    }

    /**
     * Obtener el usuario que creó este ticket.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Obtener el usuario que cerró este ticket.
     */
    public function closer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    /**
     * Obtener el pago asociado a este ticket.
     */
    public function payment(): HasOne
    {
        return $this->hasOne(PaymentHistory::class);
    }

    /**
     * Verificar si el ticket está activo.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Cerrar el ticket y calcular la duración y el monto.
     */
    public function close(float $amount, int $userId): void
    {
        $exitTime = now();
        $durationMinutes = $this->entry_time->diffInMinutes($exitTime);

        $this->update([
            'exit_time' => $exitTime,
            'duration_minutes' => $durationMinutes,
            'amount' => $amount,
            'status' => 'closed',
            'closed_by' => $userId,
        ]);

        // Liberar el espacio de estacionamiento
        $this->parkingSpace->release();
    }

    /**
     * Calcular la duración del ticket en formato legible.
     */
    public function getDurationFormatted(): string
    {
        if (!$this->exit_time) {
            return 'En curso';
        }

        $minutes = $this->duration_minutes;
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($hours > 0) {
            return "{$hours}h {$remainingMinutes}m";
        }

        return "{$minutes}m";
    }

    /**
     * Generar un número de ticket único.
     */
    public static function generateTicketNumber(): string
    {
        $prefix = 'T-';
        $date = Carbon::now()->format('Ymd');
        $random = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        return $prefix . $date . '-' . $random;
    }
}
