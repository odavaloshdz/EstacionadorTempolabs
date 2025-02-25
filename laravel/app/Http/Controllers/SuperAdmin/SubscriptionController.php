namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the subscriptions.
     */
    public function index()
    {
        $subscriptions = Subscription::with(['company', 'plan'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('SuperAdmin/Subscriptions/Index', [
            'subscriptions' => $subscriptions
        ]);
    }

    /**
     * Show the form for creating a new subscription.
     */
    public function create()
    {
        $companies = Company::where('status', 'active')->get();
        $plans = SubscriptionPlan::where('is_active', true)->get();
        
        return Inertia::render('SuperAdmin/Subscriptions/Create', [
            'companies' => $companies,
            'plans' => $plans
        ]);
    }

    /**
     * Store a newly created subscription in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,quarterly,yearly',
            'status' => 'required|string|in:active,canceled,expired,pending',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Crear la suscripción
        $subscription = Subscription::create($request->all());

        // Actualizar la información de suscripción en la empresa
        $company = Company::find($request->company_id);
        $plan = SubscriptionPlan::find($request->subscription_plan_id);
        
        $company->update([
            'subscription_start' => $request->start_date,
            'subscription_end' => $request->end_date,
            'subscription_type' => $plan->slug,
            'max_users' => $plan->max_users,
            'max_parking_spaces' => $plan->max_parking_spaces,
        ]);

        return redirect()->route('superadmin.subscriptions.index')
            ->with('success', 'Suscripción creada correctamente.');
    }

    /**
     * Display the specified subscription.
     */
    public function show(Subscription $subscription)
    {
        $subscription->load(['company', 'plan', 'paymentHistory']);
        
        return Inertia::render('SuperAdmin/Subscriptions/Show', [
            'subscription' => $subscription
        ]);
    }

    /**
     * Show the form for editing the specified subscription.
     */
    public function edit(Subscription $subscription)
    {
        $companies = Company::where('status', 'active')->get();
        $plans = SubscriptionPlan::where('is_active', true)->get();
        
        return Inertia::render('SuperAdmin/Subscriptions/Edit', [
            'subscription' => $subscription,
            'companies' => $companies,
            'plans' => $plans
        ]);
    }

    /**
     * Update the specified subscription in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,quarterly,yearly',
            'status' => 'required|string|in:active,canceled,expired,pending',
            'canceled_at' => 'nullable|date',
            'cancellation_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Actualizar la suscripción
        $subscription->update($request->all());

        // Actualizar la información de suscripción en la empresa si la suscripción está activa
        if ($request->status === 'active') {
            $company = Company::find($request->company_id);
            $plan = SubscriptionPlan::find($request->subscription_plan_id);
            
            $company->update([
                'subscription_start' => $request->start_date,
                'subscription_end' => $request->end_date,
                'subscription_type' => $plan->slug,
                'max_users' => $plan->max_users,
                'max_parking_spaces' => $plan->max_parking_spaces,
            ]);
        }

        return redirect()->route('superadmin.subscriptions.index')
            ->with('success', 'Suscripción actualizada correctamente.');
    }
} 