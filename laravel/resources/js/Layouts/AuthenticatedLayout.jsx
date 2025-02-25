import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Ticket, 
    CreditCard, 
    BarChart3, 
    Users, 
    Settings, 
    ShieldCheck, 
    Menu, 
    X, 
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarMinimized, setSidebarMinimized] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    // Detectar tamaño de pantalla para sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Definir elementos del menú
    const menuItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: route().current('dashboard')
        },
        {
            name: 'Tickets',
            href: route('tickets.index'),
            icon: Ticket,
            active: route().current('tickets.index')
        },
        {
            name: 'Pagos',
            href: '#',
            icon: CreditCard,
            active: false
        },
        {
            name: 'Reportes',
            href: '#',
            icon: BarChart3,
            active: false,
            submenu: [
                { name: 'Diarios', href: '#' },
                { name: 'Mensuales', href: '#' },
                { name: 'Anuales', href: '#' }
            ]
        },
        {
            name: 'Usuarios',
            href: '#',
            icon: Users,
            active: false
        },
        {
            name: 'Configuración',
            href: '#',
            icon: Settings,
            active: false
        },
        {
            name: 'Admin',
            href: '#',
            icon: ShieldCheck,
            active: false
        }
    ];

    const toggleSidebarMinimized = () => {
        setSidebarMinimized(!sidebarMinimized);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform bg-blue-800 transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${sidebarMinimized ? 'w-16' : 'w-64'} lg:translate-x-0`}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b border-blue-700 px-4">
                        {!sidebarMinimized && (
                            <Link href="/" className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                                        <circle cx="7" cy="17" r="2" />
                                        <path d="M9 17h6" />
                                        <circle cx="17" cy="17" r="2" />
                                    </svg>
                                </div>
                                <span className="ml-2 text-xl font-bold text-white">Estacionador</span>
                            </Link>
                        )}
                        {sidebarMinimized && (
                            <Link href="/" className="flex w-full items-center justify-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                                        <circle cx="7" cy="17" r="2" />
                                        <path d="M9 17h6" />
                                        <circle cx="17" cy="17" r="2" />
                                    </svg>
                                </div>
                            </Link>
                        )}
                        <div className="flex">
                            <button
                                className="rounded-md p-1 text-white hover:bg-blue-700"
                                onClick={toggleSidebarMinimized}
                                title={sidebarMinimized ? "Expandir menú" : "Minimizar menú"}
                            >
                                {sidebarMinimized ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                            </button>
                            <button
                                className="rounded-md p-1 text-white hover:bg-blue-700 lg:hidden ml-1"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Menú */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className={sidebarMinimized ? "px-1" : "px-2"}>
                            <ul className="space-y-1">
                                {menuItems.map((item) => (
                                    <li key={item.name}>
                                        {item.submenu && !sidebarMinimized ? (
                                            <div>
                                                <button
                                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                                                        item.active
                                                            ? 'bg-blue-700 text-white'
                                                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                                                    }`}
                                                    onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                                                >
                                                    <item.icon className="mr-3 h-5 w-5" />
                                                    <span className="flex-1 text-left">{item.name}</span>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${
                                                        activeSubmenu === item.name ? 'rotate-180' : ''
                                                    }`} />
                                                </button>
                                                {activeSubmenu === item.name && (
                                                    <ul className="mt-1 space-y-1 pl-10">
                                                        {item.submenu.map((subitem) => (
                                                            <li key={subitem.name}>
                                                                <Link
                                                                    href={subitem.href}
                                                                    className="block rounded-md px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white"
                                                                >
                                                                    {subitem.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={`flex items-center rounded-md ${sidebarMinimized ? 'justify-center' : ''} ${sidebarMinimized ? 'px-2' : 'px-3'} py-2 text-sm font-medium ${
                                                    item.active
                                                        ? 'bg-blue-700 text-white'
                                                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                                                }`}
                                                title={sidebarMinimized ? item.name : ''}
                                            >
                                                <item.icon className={`${sidebarMinimized ? '' : 'mr-3'} h-5 w-5`} />
                                                {!sidebarMinimized && item.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Perfil de usuario */}
                    <div className="border-t border-blue-700 p-4">
                        {!sidebarMinimized ? (
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <Link
                                        href={route('profile.edit')}
                                        className="text-xs text-blue-200 hover:text-white"
                                    >
                                        Ver perfil
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Link
                                    href={route('profile.edit')}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
                                    title={user.name}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className={`transition-all duration-300 ${sidebarMinimized ? 'lg:pl-16' : 'lg:pl-64'}`}>
                <div className="sticky top-0 z-40 bg-white shadow">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex-1">{header}</div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <main className="pb-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
