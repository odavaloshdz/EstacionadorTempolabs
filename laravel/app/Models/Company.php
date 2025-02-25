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
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'website',
        'logo',
        'status',
        'subscription_start',
        'subscription_end',
        'subscription_type',
        'max_users',
        'max_parking_spaces',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subscription_start' => 'date',
        'subscription_end' => 'date',
        'max_users' => 'integer',
        'max_parking_spaces' => 'integer',
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

    /**
     * Check if the company's subscription is active.
     *
     * @return bool
     */
    public function hasActiveSubscription()
    {
        if ($this->status !== 'active') {
            return false;
        }

        if (!$this->subscription_end) {
            return true;
        }

        return $this->subscription_end->isFuture();
    }

    /**
     * Check if the company has reached its user limit.
     *
     * @return bool
     */
    public function hasReachedUserLimit()
    {
        return $this->users()->count() >= $this->max_users;
    }
}
