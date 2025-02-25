<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentHistory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * El nombre de la tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'payment_history';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'subscription_id',
        'ticket_id',
        'payment_type',
        'amount',
        'payment_method',
        'transaction_id',
        'status',
        'payment_date',
        'notes',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
    ];

    /**
     * Obtener la empresa asociada a este pago.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Obtener la suscripción asociada a este pago.
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Obtener el ticket asociado a este pago.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Verificar si el pago está completado.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Verificar si el pago está pendiente.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Verificar si el pago ha fallado.
     */
    public function hasFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Verificar si el pago ha sido reembolsado.
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }
}
