<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'contact_email',
        'contact_phone',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'logo',
        'description',
        'is_active',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Obtener los usuarios asociados a la empresa.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Obtener la suscripción activa de la empresa.
     */
    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->latest();
    }

    /**
     * Obtener todas las suscripciones de la empresa.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Obtener los estacionamientos de la empresa.
     */
    public function parkingLots(): HasMany
    {
        return $this->hasMany(ParkingLot::class);
    }

    /**
     * Obtener las invitaciones de usuarios de la empresa.
     */
    public function userInvitations(): HasMany
    {
        return $this->hasMany(UserInvitation::class);
    }

    /**
     * Obtener el historial de pagos de la empresa.
     */
    public function paymentHistory(): HasMany
    {
        return $this->hasMany(PaymentHistory::class);
    }

    /**
     * Obtener los registros de actividad de la empresa.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}
