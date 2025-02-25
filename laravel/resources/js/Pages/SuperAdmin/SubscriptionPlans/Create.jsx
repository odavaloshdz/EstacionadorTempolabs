import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        billing_cycle: 'monthly',
        duration_in_days: 30,
        max_users: 5,
        max_parking_spaces: 10,
        is_active: true,
        features: [],
    });

    const [newFeature, setNewFeature] = useState('');

    const handleAddFeature = () => {
        if (newFeature.trim() !== '') {
            setData('features', [...data.features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index) => {
        const updatedFeatures = [...data.features];
        updatedFeatures.splice(index, 1);
        setData('features', updatedFeatures);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('superadmin.subscription-plans.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleBillingCycleChange = (e) => {
        const cycle = e.target.value;
        setData({
            ...data,
            billing_cycle: cycle,
            duration_in_days: cycle === 'monthly' ? 30 : cycle === 'quarterly' ? 90 : cycle === 'biannual' ? 180 : 365,
        });
    };

    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link
                        href={route('superadmin.subscription-plans.index')}
                        className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nuevo Plan de Suscripción</h2>
                </div>
            }
        >
            <Head title="Crear Plan de Suscripción" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Información básica */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Información del Plan</h3>
                                        
                                        <div>
                                            <InputLabel htmlFor="name" value="Nombre del Plan" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Descripción" />
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={data.description}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={3}
                                            />
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="price" value="Precio" />
                                            <TextInput
                                                id="price"
                                                type="number"
                                                name="price"
                                                value={data.price}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('price', e.target.value)}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                            <InputError message={errors.price} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="billing_cycle" value="Ciclo de Facturación" />
                                            <select
                                                id="billing_cycle"
                                                name="billing_cycle"
                                                value={data.billing_cycle}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={handleBillingCycleChange}
                                                required
                                            >
                                                <option value="monthly">Mensual</option>
                                                <option value="quarterly">Trimestral</option>
                                                <option value="biannual">Semestral</option>
                                                <option value="annual">Anual</option>
                                            </select>
                                            <InputError message={errors.billing_cycle} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="duration_in_days" value="Duración en Días" />
                                            <TextInput
                                                id="duration_in_days"
                                                type="number"
                                                name="duration_in_days"
                                                value={data.duration_in_days}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('duration_in_days', e.target.value)}
                                                required
                                                min="1"
                                            />
                                            <InputError message={errors.duration_in_days} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="is_active" value="Estado" />
                                            <select
                                                id="is_active"
                                                name="is_active"
                                                value={data.is_active ? 'true' : 'false'}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('is_active', e.target.value === 'true')}
                                                required
                                            >
                                                <option value="true">Activo</option>
                                                <option value="false">Inactivo</option>
                                            </select>
                                            <InputError message={errors.is_active} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Límites y características */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Límites y Características</h3>
                                        
                                        <div>
                                            <InputLabel htmlFor="max_users" value="Máximo de Usuarios" />
                                            <TextInput
                                                id="max_users"
                                                type="number"
                                                name="max_users"
                                                value={data.max_users}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('max_users', e.target.value)}
                                                required
                                                min="1"
                                            />
                                            <InputError message={errors.max_users} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="max_parking_spaces" value="Máximo de Espacios de Estacionamiento" />
                                            <TextInput
                                                id="max_parking_spaces"
                                                type="number"
                                                name="max_parking_spaces"
                                                value={data.max_parking_spaces}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('max_parking_spaces', e.target.value)}
                                                required
                                                min="1"
                                            />
                                            <InputError message={errors.max_parking_spaces} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="features" value="Características Adicionales" />
                                            <div className="mt-1 flex">
                                                <TextInput
                                                    id="new_feature"
                                                    type="text"
                                                    value={newFeature}
                                                    className="block w-full"
                                                    onChange={(e) => setNewFeature(e.target.value)}
                                                    placeholder="Ej: Reportes avanzados"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddFeature}
                                                    className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700 transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <InputError message={errors.features} className="mt-2" />

                                            {data.features.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {data.features.map((feature, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                            <span className="text-sm text-gray-700">{feature}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveFeature(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('superadmin.subscription-plans.index')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancelar
                                    </Link>

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Crear Plan
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