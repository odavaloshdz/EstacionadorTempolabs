namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::where('role', 'super_admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/Users/Create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'super_admin',
        ]);

        return redirect()->route('superadmin.users.index')
            ->with('success', 'Usuario superadmin creado correctamente.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        if ($user->role !== 'super_admin') {
            abort(404);
        }

        return Inertia::render('SuperAdmin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        if ($user->role !== 'super_admin') {
            abort(404);
        }

        return Inertia::render('SuperAdmin/Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        if ($user->role !== 'super_admin') {
            abort(404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        return redirect()->route('superadmin.users.index')
            ->with('success', 'Usuario superadmin actualizado correctamente.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        if ($user->role !== 'super_admin') {
            abort(404);
        }

        // Verificar que no sea el último usuario superadmin
        $superAdminCount = User::where('role', 'super_admin')->count();
        if ($superAdminCount <= 1) {
            return redirect()->back()
                ->with('error', 'No se puede eliminar el último usuario superadmin.');
        }

        $user->delete();

        return redirect()->route('superadmin.users.index')
            ->with('success', 'Usuario superadmin eliminado correctamente.');
    }
} 