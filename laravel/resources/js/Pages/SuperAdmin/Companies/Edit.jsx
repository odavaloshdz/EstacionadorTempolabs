import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ auth, company, subscriptionPlans }) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        logo: null,
        status: company.status || 'active',
        subscription_plan_id: company.subscription_plan_id || '',
        subscription_start: company.subscription_start || '',
        subscription_end: company.subscription_end || '',
        max_users: company.max_users || 5,
        max_parking_spaces: company.max_parking_spaces || 10,
        _method: 'PUT',
    });

    const [logoPreview, setLogoPreview] = useState(company.logo ? `/storage/${company.logo}` : null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(company.logo ? `/storage/${company.logo}` : null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('superadmin.companies.update', company.id));
    };

    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link
                        href={route('superadmin.companies.show', company.id)}
                        className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Empresa: {company.name}</h2>
                </div>
            }
        >
            <Head title={`Editar Empresa: ${company.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Información básica */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Información de la Empresa</h3>
                                        
                                        <div>
                                            <InputLabel htmlFor="name" value="Nombre" />
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
                                            <InputLabel htmlFor="address" value="Dirección" />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('address', e.target.value)}
                                            />
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone" value="Teléfono" />
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                name="phone"
                                                value={data.phone}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="website" value="Sitio Web" />
                                            <TextInput
                                                id="website"
                                                type="url"
                                                name="website"
                                                value={data.website}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('website', e.target.value)}
                                            />
                                            <InputError message={errors.website} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="logo" value="Logo" />
                                            <input
                                                id="logo"
                                                type="file"
                                                name="logo"
                                                className="mt-1 block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-md file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100"
                                                onChange={handleLogoChange}
                                                accept="image/*"
                                            />
                                            <InputError message={errors.logo} className="mt-2" />
                                            
                                            {logoPreview && (
                                                <div className="mt-3">
                                                    <img 
                                                        src={logoPreview} 
                                                        alt="Logo Preview" 
                                                        className="h-20 w-20 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="status" value="Estado" />
                                            <select
                                                id="status"
                                                name="status"
                                                value={data.status}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('status', e.target.value)}
                                                required
                                            >
                                                <option value="active">Activa</option>
                                                <option value="inactive">Inactiva</option>
                                            </select>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Información de suscripción */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Información de Suscripción</h3>
                                        
                                        <div>
                                            <InputLabel htmlFor="subscription_plan_id" value="Plan de Suscripción" />
                                            <select
                                                id="subscription_plan_id"
                                                name="subscription_plan_id"
                                                value={data.subscription_plan_id}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                onChange={(e) => setData('subscription_plan_id', e.target.value)}
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
                                            <InputLabel htmlFor="subscription_start" value="Inicio de Suscripción" />
                                            <TextInput
                                                id="subscription_start"
                                                type="date"
                                                name="subscription_start"
                                                value={data.subscription_start}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('subscription_start', e.target.value)}
                                            />
                                            <InputError message={errors.subscription_start} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="subscription_end" value="Fin de Suscripción" />
                                            <TextInput
                                                id="subscription_end"
                                                type="date"
                                                name="subscription_end"
                                                value={data.subscription_end}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('subscription_end', e.target.value)}
                                            />
                                            <InputError message={errors.subscription_end} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="max_users" value="Máximo de Usuarios" />
                                            <TextInput
                                                id="max_users"
                                                type="number"
                                                name="max_users"
                                                value={data.max_users}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('max_users', e.target.value)}
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
                                                min="1"
                                            />
                                            <InputError message={errors.max_parking_spaces} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('superadmin.companies.show', company.id)}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancelar
                                    </Link>

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Actualizar Empresa
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