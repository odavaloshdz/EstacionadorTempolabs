import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { ArrowLeft, Building2, Calendar, CreditCard, Edit, Mail, Phone, Receipt } from 'lucide-react';

export default function Show({ auth, subscription, paymentHistory }) {
    // Función para calcular días restantes
    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Función para determinar el estado de la suscripción
    const getSubscriptionStatus = () => {
        const daysRemaining = getDaysRemaining(subscription.end_date);
        
        if (daysRemaining < 0) {
            return { label: 'Vencida', className: 'bg-red-100 text-red-800' };
        } else if (daysRemaining <= 7) {
            return { label: 'Por vencer', className: 'bg-yellow-100 text-yellow-800' };
        } else {
            return { label: 'Activa', className: 'bg-green-100 text-green-800' };
        }
    };

    const status = getSubscriptionStatus();
    const daysRemaining = getDaysRemaining(subscription.end_date);

    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link
                        href={route('superadmin.subscriptions.index')}
                        className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalles de Suscripción</h2>
                    <Link
                        href={route('superadmin.subscriptions.edit', subscription.id)}
                        className="ml-4 p-2 bg-yellow-50 rounded-full shadow hover:bg-yellow-100 transition"
                    >
                        <Edit className="w-5 h-5 text-yellow-600" />
                    </Link>
                </div>
            }
        >
            <Head title="Detalles de Suscripción" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Información de la empresa */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 h-16 w-16">
                                            {subscription.company.logo ? (
                                                <img 
                                                    className="h-16 w-16 rounded-full object-cover" 
                                                    src={`/storage/${subscription.company.logo}`} 
                                                    alt={subscription.company.name} 
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Building2 className="h-8 w-8 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{subscription.company.name}</h1>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 mr-1" />
                                                    {subscription.company.email}
                                                </div>
                                                {subscription.company.phone && (
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        {subscription.company.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-lg font-medium text-gray-900">Detalles del Plan</h3>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-500">Plan de Suscripción</div>
                                                <div className="text-lg font-medium text-gray-900">{subscription.plan.name}</div>
                                                <div className="text-sm text-gray-500">{subscription.plan.description}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-500">Características</div>
                                                <div className="text-sm text-gray-700 mt-2">
                                                    <ul className="list-disc list-inside">
                                                        <li>Hasta {subscription.plan.max_users} usuarios</li>
                                                        <li>Hasta {subscription.plan.max_parking_spaces} espacios</li>
                                                        {subscription.plan.features && subscription.plan.features.split(',').map((feature, index) => (
                                                            <li key={index}>{feature.trim()}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-lg font-medium text-gray-900">Período de Suscripción</h3>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                                    <span className="text-gray-700">Período</span>
                                                </div>
                                                <div className="mt-2 text-sm">
                                                    <div>Inicio: {new Date(subscription.start_date).toLocaleDateString()}</div>
                                                    <div>Fin: {new Date(subscription.end_date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                                                    <span className="text-gray-700">Estado</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                    {daysRemaining > 0 && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {daysRemaining} días restantes
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de pago */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">Información de Pago</h3>
                                        
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Monto</div>
                                                <div className="text-2xl font-bold text-gray-900">${subscription.amount}</div>
                                            </div>
                                            
                                            <div>
                                                <div className="text-sm text-gray-500">Estado de Pago</div>
                                                <div>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        subscription.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                        subscription.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {subscription.payment_status === 'paid' ? 'Pagado' : 
                                                         subscription.payment_status === 'pending' ? 'Pendiente' : 
                                                         'Cancelado'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="text-sm text-gray-500">Método de Pago</div>
                                                <div className="text-gray-900">
                                                    {subscription.payment_method === 'bank_transfer' ? 'Transferencia Bancaria' :
                                                     subscription.payment_method === 'credit_card' ? 'Tarjeta de Crédito' :
                                                     subscription.payment_method === 'cash' ? 'Efectivo' : 'Otro'}
                                                </div>
                                            </div>
                                            
                                            {subscription.notes && (
                                                <div>
                                                    <div className="text-sm text-gray-500">Notas</div>
                                                    <div className="text-gray-700 text-sm mt-1">{subscription.notes}</div>
                                                </div>
                                            )}
                                            
                                            <div className="pt-4 border-t border-gray-200">
                                                <Link
                                                    href={route('superadmin.subscriptions.edit', subscription.id)}
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    Editar Suscripción
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Historial de pagos */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Historial de Pagos</h3>
                                </div>

                                {paymentHistory.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Monto
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Método
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Referencia
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paymentHistory.map((payment) => (
                                                    <tr key={payment.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(payment.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            ${payment.amount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.method === 'bank_transfer' ? 'Transferencia Bancaria' :
                                                             payment.method === 'credit_card' ? 'Tarjeta de Crédito' :
                                                             payment.method === 'cash' ? 'Efectivo' : 'Otro'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {payment.status === 'completed' ? 'Completado' : 
                                                                 payment.status === 'pending' ? 'Pendiente' : 
                                                                 'Fallido'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.reference || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded text-center">
                                        <Receipt className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-gray-500">No hay registros de pagos para esta suscripción.</p>
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