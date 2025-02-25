<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'subscription_plan_id',
        'status',
        'start_date',
        'end_date',
        'trial_ends_at',
        'canceled_at',
        'price',
        'billing_cycle',
        'cancellation_reason',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'trial_ends_at' => 'datetime',
        'canceled_at' => 'datetime',
        'price' => 'decimal:2',
    ];

    /**
     * Obtener la empresa asociada a esta suscripción.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Obtener el plan de suscripción asociado a esta suscripción.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    /**
     * Obtener el historial de pagos asociado a esta suscripción.
     */
    public function paymentHistory(): HasMany
    {
        return $this->hasMany(PaymentHistory::class);
    }

    /**
     * Verificar si la suscripción está activa.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Verificar si la suscripción está en período de prueba.
     */
    public function onTrial(): bool
    {
        return $this->trial_ends_at !== null && now()->lt($this->trial_ends_at);
    }

    /**
     * Verificar si la suscripción ha expirado.
     */
    public function hasExpired(): bool
    {
        return $this->end_date !== null && now()->gt($this->end_date);
    }
}
