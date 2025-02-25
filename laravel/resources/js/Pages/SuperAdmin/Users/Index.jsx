import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Edit, Plus, Trash2, User } from 'lucide-react';

export default function Index({ auth, users }) {
    return (
        <SuperAdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios SuperAdmin</h2>
                    <Link
                        href={route('superadmin.users.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Usuario</span>
                    </Link>
                </div>
            }
        >
            <Head title="Usuarios SuperAdmin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {users.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Usuario
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha de Registro
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                <User className="h-6 w-6 text-indigo-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('superadmin.users.edit', user.id)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </Link>
                                                            {users.length > 1 && (
                                                                <Link
                                                                    href={route('superadmin.users.destroy', user.id)}
                                                                    method="delete"
                                                                    as="button"
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Eliminar"
                                                                    onClick={(e) => {
                                                                        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <User className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios SuperAdmin</h3>
                                    <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo usuario SuperAdmin.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('superadmin.users.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            Nuevo Usuario
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