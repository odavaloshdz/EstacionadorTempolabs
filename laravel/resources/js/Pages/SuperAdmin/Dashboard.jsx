import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { 
    Building2, 
    Users, 
    CreditCard, 
    BarChart4, 
    Calendar, 
    AlertTriangle 
} from 'lucide-react';

export default function Dashboard({ auth, stats, recentCompanies, expiringSubscriptions }) {
    return (
        <SuperAdminLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Panel de Control</h2>}
        >
            <Head title="Panel de Control" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Estadísticas */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Empresas Totales</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalCompanies}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <Building2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Empresas Activas</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.activeCompanies}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                                    <CreditCard className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Suscripciones</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.subscriptionsByType.basic + 
                                         stats.subscriptionsByType.premium + 
                                         stats.subscriptionsByType.enterprise}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Distribución de suscripciones */}
                    <div className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Distribución de Suscripciones</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center">
                                <div className="mb-2 h-24 w-24 rounded-full bg-blue-100 p-4 text-center">
                                    <span className="text-2xl font-bold text-blue-600">{stats.subscriptionsByType.basic}</span>
                                    <p className="text-xs text-blue-800">Básico</p>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Plan Básico</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="mb-2 h-24 w-24 rounded-full bg-purple-100 p-4 text-center">
                                    <span className="text-2xl font-bold text-purple-600">{stats.subscriptionsByType.premium}</span>
                                    <p className="text-xs text-purple-800">Premium</p>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Plan Premium</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="mb-2 h-24 w-24 rounded-full bg-green-100 p-4 text-center">
                                    <span className="text-2xl font-bold text-green-600">{stats.subscriptionsByType.enterprise}</span>
                                    <p className="text-xs text-green-800">Empresarial</p>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Plan Empresarial</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Empresas recientes */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                                <h3 className="text-sm font-medium text-gray-700">Empresas Recientes</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentCompanies.length > 0 ? (
                                    recentCompanies.map((company) => (
                                        <div key={company.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center">
                                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                    <Building2 className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{company.name}</p>
                                                    <p className="text-sm text-gray-500">{company.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    company.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : company.status === 'inactive' 
                                                            ? 'bg-gray-100 text-gray-800' 
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {company.status === 'active' ? 'Activa' : 
                                                     company.status === 'inactive' ? 'Inactiva' : 'Suspendida'}
                                                </span>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {new Date(company.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No hay empresas recientes
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suscripciones por vencer */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                                <h3 className="text-sm font-medium text-gray-700">Suscripciones por Vencer</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {expiringSubscriptions.length > 0 ? (
                                    expiringSubscriptions.map((company) => (
                                        <div key={company.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center">
                                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{company.name}</p>
                                                    <p className="text-sm text-gray-500">{company.subscription_type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-red-600">
                                                    {new Date(company.subscription_end).toLocaleDateString()}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {getDaysRemaining(company.subscription_end)} días restantes
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No hay suscripciones por vencer pronto
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}

function getDaysRemaining(dateString) {
    const today = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
} 