<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Obtener la empresa asociada a este registro de actividad.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Obtener el usuario asociado a este registro de actividad.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Registrar una actividad de inicio de sesión.
     */
    public static function logLogin(int $userId, int $companyId, string $ipAddress, string $userAgent): self
    {
        return self::create([
            'company_id' => $companyId,
            'user_id' => $userId,
            'action' => 'login',
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Registrar una actividad de cierre de sesión.
     */
    public static function logLogout(int $userId, int $companyId, string $ipAddress, string $userAgent): self
    {
        return self::create([
            'company_id' => $companyId,
            'user_id' => $userId,
            'action' => 'logout',
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Registrar una actividad de creación de entidad.
     */
    public static function logCreate(int $userId, int $companyId, string $entityType, int $entityId, array $values, string $ipAddress, string $userAgent): self
    {
        return self::create([
            'company_id' => $companyId,
            'user_id' => $userId,
            'action' => 'create',
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'new_values' => $values,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Registrar una actividad de actualización de entidad.
     */
    public static function logUpdate(int $userId, int $companyId, string $entityType, int $entityId, array $oldValues, array $newValues, string $ipAddress, string $userAgent): self
    {
        return self::create([
            'company_id' => $companyId,
            'user_id' => $userId,
            'action' => 'update',
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Registrar una actividad de eliminación de entidad.
     */
    public static function logDelete(int $userId, int $companyId, string $entityType, int $entityId, array $values, string $ipAddress, string $userAgent): self
    {
        return self::create([
            'company_id' => $companyId,
            'user_id' => $userId,
            'action' => 'delete',
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $values,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }
}
