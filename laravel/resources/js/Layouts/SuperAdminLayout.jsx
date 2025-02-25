import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    ChevronLeft, 
    ChevronRight, 
    LayoutDashboard, 
    Building2, 
    CreditCard, 
    Users, 
    Settings, 
    LogOut, 
    Menu, 
    X 
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function SuperAdminLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setIsSidebarMinimized(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const { url } = usePage();

    const navigation = [
        { name: 'Dashboard', href: route('superadmin.dashboard'), icon: LayoutDashboard, current: url.startsWith('/superadmin/dashboard') },
        { name: 'Empresas', href: route('superadmin.companies.index'), icon: Building2, current: url.startsWith('/superadmin/companies') },
        { name: 'Suscripciones', href: route('superadmin.subscriptions.index'), icon: CreditCard, current: url.startsWith('/superadmin/subscriptions') },
        { name: 'Usuarios', href: route('superadmin.users.index'), icon: Users, current: url.startsWith('/superadmin/users') },
    ];

    const toggleSidebarMinimized = () => {
        setIsSidebarMinimized(!isSidebarMinimized);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar para pantallas medianas y grandes */}
            <div
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-blue-800 transition-all duration-300 ease-in-out ${
                    isSidebarMinimized ? 'w-16' : 'w-64'
                } ${showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-blue-700 px-4">
                    <Link href={route('superadmin.dashboard')} className="flex items-center">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                        {!isSidebarMinimized && (
                            <span className="ml-3 text-xl font-bold text-white">SuperAdmin</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setShowingNavigationDropdown(false)}
                        className="rounded-md p-2 text-blue-300 hover:bg-blue-700 hover:text-white md:hidden"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto">
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                                    item.current
                                        ? 'bg-blue-900 text-white'
                                        : 'text-blue-300 hover:bg-blue-700 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                        item.current ? 'text-white' : 'text-blue-300 group-hover:text-white'
                                    }`}
                                    aria-hidden="true"
                                />
                                {!isSidebarMinimized && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-shrink-0 border-t border-blue-700 p-2">
                    <button
                        onClick={toggleSidebarMinimized}
                        className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-blue-300 hover:bg-blue-700 hover:text-white"
                    >
                        {isSidebarMinimized ? (
                            <ChevronRight className="h-6 w-6" />
                        ) : (
                            <>
                                <ChevronLeft className="mr-3 h-6 w-6" />
                                <span>Minimizar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Contenido principal */}
            <div
                className={`flex min-h-screen flex-col transition-all duration-300 ${
                    isSidebarMinimized ? 'md:pl-16' : 'md:pl-64'
                }`}
            >
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
                    <button
                        onClick={() => setShowingNavigationDropdown(true)}
                        className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                    >
                        <span className="sr-only">Abrir sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1 items-center">
                            {header && (
                                <header className="bg-white">
                                    <div className="mx-auto py-6">{header}</div>
                                </header>
                            )}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            {/* Perfil del usuario */}
                            <div className="relative ml-3">
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm font-medium text-gray-700">{user.name}</span>
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="ml-4 rounded-md bg-red-100 p-1 text-red-600 hover:bg-red-200"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
} 