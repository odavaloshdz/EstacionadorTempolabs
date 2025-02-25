import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ auth, subscription, companies, subscriptionPlans }) {
    const { data, setData, put, processing, errors } = useForm({
        company_id: subscription.company_id || '',
        subscription_plan_id: subscription.subscription_plan_id || '',
        start_date: subscription.start_date || '',
        end_date: subscription.end_date || '',
        amount: subscription.amount || '',
        payment_status: subscription.payment_status || 'pending',
        payment_method: subscription.payment_method || 'bank_transfer',
        notes: subscription.notes || '',
        _method: 'PUT',
    });

    // Cuando cambia el plan de suscripción, actualizar el monto y la fecha de fin
    const handlePlanChange = (e) => {
        const planId = e.target.value;
        setData('subscription_plan_id', planId);
        
        if (planId) {
            const selectedPlan = subscriptionPlans.find(plan => plan.id == planId);
            if (selectedPlan) {
                setData('amount', selectedPlan.price);
                
                // Calcular fecha de fin basada en la duración del plan
                if (data.start_date) {
                    const startDate = new Date(data.start_date);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + selectedPlan.duration_in_days);
                    setData('end_date', endDate.toISOString().substr(0, 10));
                }
            }
        }
    };

    // Cuando cambia la fecha de inicio, recalcular la fecha de fin
    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setData('start_date', startDate);
        
        if (startDate && data.subscription_plan_id) {
            const selectedPlan = subscriptionPlans.find(plan => plan.id == data.subscription_plan_id);
            if (selectedPlan) {
                const start = new Date(startDate);
                const endDate = new Date(start);
                endDate.setDate(start.getDate() + selectedPlan.duration_in_days);
                setData('end_date', endDate.toISOString().substr(0, 10));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('superadmin.subscriptions.update', subscription.id));
    };

    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link
                        href={route('superadmin.subscriptions.show', subscription.id)}
                        className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Suscripción</h2>
                </div>
            }
        >
            <Head title="Editar Suscripción" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Información básica */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Información de la Suscripción</h3>
                                        
                                        <div>
                                            <InputLabel htmlFor="company_id" value="Empresa" />
                                            <select
                                                id="company_id"
                                                name="company_id"
                                                value={data.company_id}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('company_id', e.target.value)}
                                                required
                                                disabled
                                            >
                                                <option value="">Seleccionar Empresa</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.company_id} className="mt-2" />
                                            <p className="mt-1 text-sm text-gray-500">La empresa no se puede cambiar una vez creada la suscripción.</p>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="subscription_plan_id" value="Plan de Suscripción" />
                                            <select
                                                id="subscription_plan_id"
                                                name="subscription_plan_id"
                                                value={data.subscription_plan_id}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={handlePlanChange}
                                                required
                                            >
                                                <option value="">Seleccionar Plan</option>
                                                {subscriptionPlans.map((plan) => (
                                                    <option key={plan.id} value={plan.id}>
                                                        {plan.name} - ${plan.price} / {plan.billing_cycle}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.subscription_plan_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="start_date" value="Fecha de Inicio" />
                                            <TextInput
                                                id="start_date"
                                                type="date"
                                                name="start_date"
                                                value={data.start_date}
                                                className="mt-1 block w-full"
                                                onChange={handleStartDateChange}
                                                required
                                            />
                                            <InputError message={errors.start_date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="end_date" value="Fecha de Fin" />
                                            <TextInput
                                                id="end_date"
                                                type="date"
                                                name="end_date"
                                                value={data.end_date}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.end_date} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Información de pago */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Información de Pago</h3>
                                        
                                        <div>
                                            <InputLabel htmlFor="amount" value="Monto" />
                                            <TextInput
                                                id="amount"
                                                type="number"
                                                name="amount"
                                                value={data.amount}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('amount', e.target.value)}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                            <InputError message={errors.amount} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="payment_status" value="Estado de Pago" />
                                            <select
                                                id="payment_status"
                                                name="payment_status"
                                                value={data.payment_status}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('payment_status', e.target.value)}
                                                required
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="paid">Pagado</option>
                                                <option value="cancelled">Cancelado</option>
                                            </select>
                                            <InputError message={errors.payment_status} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="payment_method" value="Método de Pago" />
                                            <select
                                                id="payment_method"
                                                name="payment_method"
                                                value={data.payment_method}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                required
                                            >
                                                <option value="bank_transfer">Transferencia Bancaria</option>
                                                <option value="credit_card">Tarjeta de Crédito</option>
                                                <option value="cash">Efectivo</option>
                                                <option value="other">Otro</option>
                                            </select>
                                            <InputError message={errors.payment_method} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="notes" value="Notas" />
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={data.notes}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows={3}
                                            />
                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('superadmin.subscriptions.show', subscription.id)}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancelar
                                    </Link>

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Actualizar Suscripción
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
} 