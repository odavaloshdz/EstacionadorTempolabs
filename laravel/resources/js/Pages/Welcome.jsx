import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Estacionador - Sistema de Gestión de Estacionamientos" />
            <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMUUzQTgiIGQ9Ik0wIDBoMTQ0MHY3NjhIMHoiLz48cGF0aCBkPSJNMTQ0MCA3NjhIMFYwaDEyODBDMTI4MCA0MjQuOCAxNDQwIDc2OCAxNDQwIDc2OHoiIGZpbGw9IiMxMTI4NkYiLz48L2c+PC9zdmc+')] bg-cover opacity-50"></div>
                    </div>
                    
                    <div className="relative w-full max-w-6xl px-6 py-12 lg:py-24">
                        <header className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M3 9h18" />
                                    <path d="M9 21V9" />
                                </svg>
                                <h1 className="ml-3 text-3xl font-bold text-white">Estacionador</h1>
                            </div>
                            <nav className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md border border-white px-4 py-2 font-medium text-white transition hover:bg-white/10"
                                        >
                                            Registrarse
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main>
                            <div className="grid gap-12 md:grid-cols-2 md:items-center">
                                <div>
                                    <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
                                        Gestión inteligente de estacionamientos
                                    </h2>
                                    <p className="mb-8 text-xl text-blue-100">
                                        Optimiza la operación de tu estacionamiento con nuestro sistema completo de gestión. Control de acceso, emisión de tickets, reportes y más.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-white px-6 py-3 font-bold text-blue-900 transition hover:bg-blue-100"
                                        >
                                            Comenzar ahora
                                        </Link>
                                        <a
                                            href="#features"
                                            className="rounded-md border border-white px-6 py-3 font-bold text-white transition hover:bg-white/10"
                                        >
                                            Conocer más
                                        </a>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="overflow-hidden rounded-lg bg-white/10 p-2 shadow-xl backdrop-blur-sm">
                                        <div className="rounded-md bg-blue-800 p-4">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="text-lg font-bold">Estacionamiento Central</div>
                                                <div className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium">
                                                    12 espacios disponibles
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3">
                                                {[...Array(16)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`aspect-square rounded ${
                                                            i % 3 === 0
                                                                ? 'bg-red-500'
                                                                : 'bg-green-500'
                                                        } flex items-center justify-center text-sm font-bold`}
                                                    >
                                                        {String.fromCharCode(65 + Math.floor(i / 4))}{i % 4 + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue-500 opacity-50 blur-2xl"></div>
                                    <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-blue-300 opacity-50 blur-2xl"></div>
                                </div>
                            </div>

                            <div id="features" className="mt-24">
                                <h2 className="mb-12 text-center text-3xl font-bold text-white">Características principales</h2>
                                <div className="grid gap-8 md:grid-cols-3">
                                    <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                                        <div className="mb-4 rounded-full bg-blue-600 p-3 w-12 h-12 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <path d="M3 9h18" />
                                                <path d="M9 21V9" />
                                        </svg>
                                    </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">Gestión de espacios</h3>
                                        <p className="text-blue-100">
                                            Visualiza en tiempo real el estado de cada espacio de estacionamiento. Identifica rápidamente los espacios disponibles y ocupados.
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                                        <div className="mb-4 rounded-full bg-blue-600 p-3 w-12 h-12 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                                <path d="M12 11h4" />
                                                <path d="M12 16h4" />
                                                <path d="M8 11h.01" />
                                                <path d="M8 16h.01" />
                                        </svg>
                                    </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">Emisión de tickets</h3>
                                        <p className="text-blue-100">
                                            Genera tickets de entrada y salida con cálculo automático de tarifas. Imprime recibos para tus clientes.
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                                        <div className="mb-4 rounded-full bg-blue-600 p-3 w-12 h-12 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 20V10" />
                                                <path d="M18 20V4" />
                                                <path d="M6 20v-4" />
                                        </svg>
                                    </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">Reportes y estadísticas</h3>
                                        <p className="text-blue-100">
                                            Analiza el rendimiento de tu estacionamiento con reportes detallados. Visualiza tendencias de ocupación y genera informes financieros.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="mt-24 border-t border-white/20 pt-8 text-center text-sm text-blue-200">
                            <p>© {new Date().getFullYear()} Estacionador. Todos los derechos reservados.</p>
                            <p className="mt-2">Versión {laravelVersion} | PHP {phpVersion}</p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
