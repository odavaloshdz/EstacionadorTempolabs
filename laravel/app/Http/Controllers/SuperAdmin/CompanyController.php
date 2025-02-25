namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the companies.
     */
    public function index()
    {
        $companies = Company::with('activeSubscription.plan')
            ->latest()
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                    'phone' => $company->phone,
                    'logo' => $company->logo ? Storage::url($company->logo) : null,
                    'created_at' => $company->created_at,
                    'subscription' => $company->activeSubscription ? [
                        'plan_name' => $company->activeSubscription->plan->name,
                        'end_date' => $company->activeSubscription->end_date,
                        'status' => $company->activeSubscription->status,
                    ] : null,
                    'users_count' => $company->users()->count(),
                ];
            });

        return Inertia::render('SuperAdmin/Companies/Index', [
            'companies' => $companies,
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create()
    {
        $subscriptionPlans = SubscriptionPlan::where('is_active', true)
            ->orderBy('price')
            ->get();

        return Inertia::render('SuperAdmin/Companies/Create', [
            'subscriptionPlans' => $subscriptionPlans,
        ]);
    }

    /**
     * Store a newly created company in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|max:1024',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Procesar el logo si se ha subido
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('company_logos', 'public');
        }

        // Crear la empresa
        $company = Company::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'website' => $request->website,
            'logo' => $logoPath,
            'status' => 'active',
        ]);

        return redirect()->route('superadmin.companies.index')
            ->with('success', 'Empresa creada con éxito.');
    }

    /**
     * Display the specified company.
     */
    public function show(Company $company)
    {
        $company->load('activeSubscription.plan', 'parkingLots');
        
        $users = $company->users()
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->get();

        return Inertia::render('SuperAdmin/Companies/Show', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'phone' => $company->phone,
                'address' => $company->address,
                'website' => $company->website,
                'logo' => $company->logo ? Storage::url($company->logo) : null,
                'created_at' => $company->created_at,
                'subscription' => $company->activeSubscription ? [
                    'id' => $company->activeSubscription->id,
                    'plan_name' => $company->activeSubscription->plan->name,
                    'start_date' => $company->activeSubscription->start_date,
                    'end_date' => $company->activeSubscription->end_date,
                    'status' => $company->activeSubscription->status,
                ] : null,
            ],
            'users' => $users,
            'parkingLots' => $company->parkingLots,
        ]);
    }

    /**
     * Show the form for editing the specified company.
     */
    public function edit(Company $company)
    {
        $subscriptionPlans = SubscriptionPlan::where('is_active', true)
            ->orderBy('price')
            ->get();

        return Inertia::render('SuperAdmin/Companies/Edit', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'phone' => $company->phone,
                'address' => $company->address,
                'website' => $company->website,
                'logo' => $company->logo ? Storage::url($company->logo) : null,
            ],
            'subscriptionPlans' => $subscriptionPlans,
        ]);
    }

    /**
     * Update the specified company in storage.
     */
    public function update(Request $request, Company $company)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|max:1024',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Procesar el logo si se ha subido uno nuevo
        if ($request->hasFile('logo')) {
            // Eliminar el logo anterior si existe
            if ($company->logo) {
                Storage::disk('public')->delete($company->logo);
            }
            
            $logoPath = $request->file('logo')->store('company_logos', 'public');
            $company->logo = $logoPath;
        }

        // Actualizar la empresa
        $company->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'website' => $request->website,
        ]);

        return redirect()->route('superadmin.companies.index')
            ->with('success', 'Empresa actualizada con éxito.');
    }

    /**
     * Remove the specified company from storage.
     */
    public function destroy(Company $company)
    {
        // Verificar si hay usuarios asociados
        if ($company->users()->count() > 0) {
            return back()->with('error', 'No se puede eliminar la empresa porque tiene usuarios asociados.');
        }

        // Eliminar el logo si existe
        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }

        // Eliminar la empresa
        $company->delete();

        return redirect()->route('superadmin.companies.index')
            ->with('success', 'Empresa eliminada con éxito.');
    }
} 