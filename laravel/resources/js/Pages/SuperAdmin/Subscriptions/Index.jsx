import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Calendar, CreditCard, Edit, Plus, Building2 } from 'lucide-react';

export default function Index({ auth, subscriptions }) {
    // Función para calcular días restantes
    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Función para determinar el estado de la suscripción
    const getSubscriptionStatus = (subscription) => {
        const daysRemaining = getDaysRemaining(subscription.end_date);
        
        if (daysRemaining < 0) {
            return { label: 'Vencida', className: 'bg-red-100 text-red-800' };
        } else if (daysRemaining <= 7) {
            return { label: 'Por vencer', className: 'bg-yellow-100 text-yellow-800' };
        } else {
            return { label: 'Activa', className: 'bg-green-100 text-green-800' };
        }
    };

    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Suscripciones</h2>
                    <Link
                        href={route('superadmin.subscriptions.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nueva Suscripción</span>
                    </Link>
                </div>
            }
        >
            <Head title="Suscripciones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {subscriptions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Empresa
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Plan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Período
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Monto
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {subscriptions.map((subscription) => {
                                                const status = getSubscriptionStatus(subscription);
                                                return (
                                                    <tr key={subscription.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    {subscription.company.logo ? (
                                                                        <img className="h-10 w-10 rounded-full object-cover" src={`/storage/${subscription.company.logo}`} alt={subscription.company.name} />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                            <Building2 className="h-6 w-6 text-gray-500" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{subscription.company.name}</div>
                                                                    <div className="text-sm text-gray-500">{subscription.company.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{subscription.plan.name}</div>
                                                            <div className="text-sm text-gray-500">{subscription.plan.billing_cycle}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center text-sm text-gray-900">
                                                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                                {new Date(subscription.start_date).toLocaleDateString()}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                                {new Date(subscription.end_date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                                                                {status.label}
                                                            </span>
                                                            {getDaysRemaining(subscription.end_date) > 0 && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {getDaysRemaining(subscription.end_date)} días restantes
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">${subscription.amount}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {subscription.payment_status === 'paid' ? (
                                                                    <span className="text-green-600">Pagado</span>
                                                                ) : subscription.payment_status === 'pending' ? (
                                                                    <span className="text-yellow-600">Pendiente</span>
                                                                ) : (
                                                                    <span className="text-red-600">Cancelado</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route('superadmin.subscriptions.show', subscription.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    title="Ver detalles"
                                                                >
                                                                    <CreditCard className="w-5 h-5" />
                                                                </Link>
                                                                <Link
                                                                    href={route('superadmin.subscriptions.edit', subscription.id)}
                                                                    className="text-yellow-600 hover:text-yellow-900"
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-5 h-5" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay suscripciones</h3>
                                    <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva suscripción para una empresa.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('superadmin.subscriptions.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            Nueva Suscripción
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