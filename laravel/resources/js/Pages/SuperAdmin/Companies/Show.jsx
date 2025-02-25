import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { ArrowLeft, Building2, Calendar, Edit, Mail, MapPin, Phone, Users, Car, Globe } from 'lucide-react';

export default function Show({ auth, company, users, parkingLots }) {
    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link
                        href={route('superadmin.companies.index')}
                        className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalles de Empresa</h2>
                    <Link
                        href={route('superadmin.companies.edit', company.id)}
                        className="ml-4 p-2 bg-yellow-50 rounded-full shadow hover:bg-yellow-100 transition"
                    >
                        <Edit className="w-5 h-5 text-yellow-600" />
                    </Link>
                </div>
            }
        >
            <Head title={`Empresa: ${company.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Información básica */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 h-20 w-20">
                                            {company.logo ? (
                                                <img 
                                                    className="h-20 w-20 rounded-full object-cover" 
                                                    src={`/storage/${company.logo}`} 
                                                    alt={company.name} 
                                                />
                                            ) : (
                                                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Building2 className="h-10 w-10 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {company.status === 'active' ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
                                        <div className="mt-4 space-y-3">
                                            {company.address && (
                                                <div className="flex items-start">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                    <span className="text-gray-700">{company.address}</span>
                                                </div>
                                            )}
                                            {company.phone && (
                                                <div className="flex items-center">
                                                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                                    <span className="text-gray-700">{company.phone}</span>
                                                </div>
                                            )}
                                            {company.email && (
                                                <div className="flex items-center">
                                                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                                    <span className="text-gray-700">{company.email}</span>
                                                </div>
                                            )}
                                            {company.website && (
                                                <div className="flex items-center">
                                                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                                        {company.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-lg font-medium text-gray-900">Límites de la Cuenta</h3>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                                                    <span className="text-gray-700">Usuarios Máximos</span>
                                                </div>
                                                <div className="mt-2 text-2xl font-semibold text-gray-900">
                                                    {users.length} / {company.max_users}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    {Math.round((users.length / company.max_users) * 100)}% utilizado
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <Car className="h-5 w-5 text-gray-400 mr-3" />
                                                    <span className="text-gray-700">Espacios de Estacionamiento</span>
                                                </div>
                                                <div className="mt-2 text-2xl font-semibold text-gray-900">
                                                    {parkingLots.reduce((total, lot) => total + lot.spaces_count, 0)} / {company.max_parking_spaces}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    {Math.round((parkingLots.reduce((total, lot) => total + lot.spaces_count, 0) / company.max_parking_spaces) * 100)}% utilizado
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de suscripción */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">Información de Suscripción</h3>
                                        
                                        {company.subscription_type ? (
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <div className="text-sm text-gray-500">Plan</div>
                                                    <div className="text-lg font-medium text-gray-900">{company.subscription_type}</div>
                                                </div>
                                                
                                                {company.subscription_start && (
                                                    <div>
                                                        <div className="text-sm text-gray-500">Fecha de Inicio</div>
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="text-gray-900">
                                                                {new Date(company.subscription_start).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {company.subscription_end && (
                                                    <div>
                                                        <div className="text-sm text-gray-500">Fecha de Vencimiento</div>
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="text-gray-900">
                                                                {new Date(company.subscription_end).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {company.subscription_end && (
                                                    <div>
                                                        <div className="text-sm text-gray-500">Estado</div>
                                                        <div>
                                                            {new Date(company.subscription_end) > new Date() ? (
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    Activa
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                    Vencida
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="pt-4 border-t border-gray-200">
                                                    <Link
                                                        href={route('superadmin.subscriptions.create', { company_id: company.id })}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        Renovar Suscripción
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-4">
                                                <p className="text-gray-500">Esta empresa no tiene una suscripción activa.</p>
                                                <div className="mt-4">
                                                    <Link
                                                        href={route('superadmin.subscriptions.create', { company_id: company.id })}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        Agregar Suscripción
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Usuarios de la empresa */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Usuarios ({users.length})</h3>
                                    <Link
                                        href={route('superadmin.companies.users.create', company.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700 transition"
                                    >
                                        Agregar Usuario
                                    </Link>
                                </div>

                                {users.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rol
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha de Registro
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded text-center">
                                        <p className="text-gray-500">No hay usuarios registrados para esta empresa.</p>
                                    </div>
                                )}
                            </div>

                            {/* Estacionamientos de la empresa */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Estacionamientos ({parkingLots.length})</h3>
                                </div>

                                {parkingLots.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {parkingLots.map((lot) => (
                                            <div key={lot.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                                <div className="p-4">
                                                    <h4 className="text-lg font-medium text-gray-900">{lot.name}</h4>
                                                    <p className="text-sm text-gray-500">{lot.address}</p>
                                                    <div className="mt-3 flex justify-between">
                                                        <div>
                                                            <span className="text-xs text-gray-500">Espacios</span>
                                                            <p className="text-sm font-medium">{lot.spaces_count}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500">Ocupación</span>
                                                            <p className="text-sm font-medium">{lot.occupied_spaces} / {lot.spaces_count}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500">Estado</span>
                                                            <p className={`text-sm font-medium ${lot.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {lot.status === 'active' ? 'Activo' : 'Inactivo'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded text-center">
                                        <p className="text-gray-500">No hay estacionamientos registrados para esta empresa.</p>
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