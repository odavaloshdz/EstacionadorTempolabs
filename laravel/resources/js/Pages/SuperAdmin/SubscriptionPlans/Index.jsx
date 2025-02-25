import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { CreditCard, Edit, Plus, Trash2 } from 'lucide-react';

export default function Index({ auth, subscriptionPlans }) {
    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Planes de Suscripción</h2>
                    <Link
                        href={route('superadmin.subscription-plans.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Plan</span>
                    </Link>
                </div>
            }
        >
            <Head title="Planes de Suscripción" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {subscriptionPlans.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Plan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Precio
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ciclo de Facturación
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Características
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {subscriptionPlans.map((plan) => (
                                                <tr key={plan.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                                                                <CreditCard className="h-5 w-5 text-indigo-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                                                                <div className="text-sm text-gray-500">{plan.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">${plan.price}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{plan.billing_cycle}</div>
                                                        <div className="text-sm text-gray-500">{plan.duration_in_days} días</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            <ul className="list-disc list-inside">
                                                                <li>Hasta {plan.max_users} usuarios</li>
                                                                <li>Hasta {plan.max_parking_spaces} espacios</li>
                                                                {plan.features && plan.features.split(',').map((feature, index) => (
                                                                    <li key={index}>{feature.trim()}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {plan.is_active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('superadmin.subscription-plans.edit', plan.id)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </Link>
                                                            <Link
                                                                href={route('superadmin.subscription-plans.destroy', plan.id)}
                                                                method="delete"
                                                                as="button"
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Eliminar"
                                                                onClick={(e) => {
                                                                    if (!confirm('¿Estás seguro de que deseas eliminar este plan?')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay planes de suscripción</h3>
                                    <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo plan de suscripción.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('superadmin.subscription-plans.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            Nuevo Plan
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
} 