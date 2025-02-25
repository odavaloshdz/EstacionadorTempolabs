namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the superadmin dashboard.
     */
    public function index()
    {
        // Obtener estadísticas para el dashboard
        $stats = [
            'totalCompanies' => Company::count(),
            'activeCompanies' => Company::whereHas('activeSubscription')->count(),
            'totalUsers' => User::count(),
            'totalSubscriptions' => Subscription::count(),
        ];

        // Obtener las últimas empresas registradas
        $recentCompanies = Company::with('activeSubscription.plan')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                    'phone' => $company->phone,
                    'created_at' => $company->created_at,
                    'subscription' => $company->activeSubscription ? [
                        'plan_name' => $company->activeSubscription->plan->name,
                        'end_date' => $company->activeSubscription->end_date,
                    ] : null,
                ];
            });

        // Obtener las suscripciones próximas a vencer
        $expiringSubscriptions = Subscription::with(['company', 'plan'])
            ->where('status', 'active')
            ->whereDate('end_date', '<=', now()->addDays(30))
            ->whereDate('end_date', '>=', now())
            ->orderBy('end_date')
            ->take(5)
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'company_name' => $subscription->company->name,
                    'plan_name' => $subscription->plan->name,
                    'end_date' => $subscription->end_date,
                    'company_id' => $subscription->company_id,
                ];
            });

        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => $stats,
            'recentCompanies' => $recentCompanies,
            'expiringSubscriptions' => $expiringSubscriptions,
        ]);
    }
} 