<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the subscription plans.
     */
    public function index()
    {
        $subscriptionPlans = SubscriptionPlan::withCount('subscriptions')
            ->orderBy('price')
            ->get();

        return Inertia::render('SuperAdmin/SubscriptionPlans/Index', [
            'subscriptionPlans' => $subscriptionPlans,
        ]);
    }

    /**
     * Show the form for creating a new subscription plan.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/SubscriptionPlans/Create');
    }

    /**
     * Store a newly created subscription plan in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,quarterly,yearly',
            'max_parking_lots' => 'required|integer|min:1',
            'max_parking_spaces' => 'required|integer|min:1',
            'max_users' => 'required|integer|min:1',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Crear el slug a partir del nombre
        $slug = Str::slug($request->name);
        
        // Verificar si el slug ya existe
        $count = SubscriptionPlan::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        // Crear el plan de suscripción
        SubscriptionPlan::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'price' => $request->price,
            'billing_cycle' => $request->billing_cycle,
            'max_parking_lots' => $request->max_parking_lots,
            'max_parking_spaces' => $request->max_parking_spaces,
            'max_users' => $request->max_users,
            'features' => $request->features,
            'is_active' => $request->is_active ?? true,
            'is_featured' => $request->is_featured ?? false,
        ]);

        return redirect()->route('superadmin.subscription-plans.index')
            ->with('success', 'Plan de suscripción creado con éxito.');
    }

    /**
     * Display the specified subscription plan.
     */
    public function show(SubscriptionPlan $subscriptionPlan)
    {
        $subscriptionPlan->load('subscriptions.company');

        return Inertia::render('SuperAdmin/SubscriptionPlans/Show', [
            'subscriptionPlan' => $subscriptionPlan,
            'subscriptions' => $subscriptionPlan->subscriptions->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'company_name' => $subscription->company->name,
                    'start_date' => $subscription->start_date,
                    'end_date' => $subscription->end_date,
                    'status' => $subscription->status,
                ];
            }),
        ]);
    }

    /**
     * Show the form for editing the specified subscription plan.
     */
    public function edit(SubscriptionPlan $subscriptionPlan)
    {
        return Inertia::render('SuperAdmin/SubscriptionPlans/Edit', [
            'subscriptionPlan' => $subscriptionPlan,
        ]);
    }

    /**
     * Update the specified subscription plan in storage.
     */
    public function update(Request $request, SubscriptionPlan $subscriptionPlan)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,quarterly,yearly',
            'max_parking_lots' => 'required|integer|min:1',
            'max_parking_spaces' => 'required|integer|min:1',
            'max_users' => 'required|integer|min:1',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Actualizar el plan de suscripción
        $subscriptionPlan->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'billing_cycle' => $request->billing_cycle,
            'max_parking_lots' => $request->max_parking_lots,
            'max_parking_spaces' => $request->max_parking_spaces,
            'max_users' => $request->max_users,
            'features' => $request->features,
            'is_active' => $request->is_active ?? $subscriptionPlan->is_active,
            'is_featured' => $request->is_featured ?? $subscriptionPlan->is_featured,
        ]);

        return redirect()->route('superadmin.subscription-plans.index')
            ->with('success', 'Plan de suscripción actualizado con éxito.');
    }

    /**
     * Remove the specified subscription plan from storage.
     */
    public function destroy(SubscriptionPlan $subscriptionPlan)
    {
        // Verificar si hay suscripciones asociadas
        if ($subscriptionPlan->subscriptions()->count() > 0) {
            return back()->with('error', 'No se puede eliminar el plan porque tiene suscripciones asociadas.');
        }

        // Eliminar el plan de suscripción
        $subscriptionPlan->delete();

        return redirect()->route('superadmin.subscription-plans.index')
            ->with('success', 'Plan de suscripción eliminado con éxito.');
    }
} 