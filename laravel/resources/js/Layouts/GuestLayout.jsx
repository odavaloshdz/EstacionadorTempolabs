import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-900 to-blue-700 pt-6 sm:justify-center sm:pt-0">
            <div className="relative w-full max-w-6xl px-6 py-12">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMUUzQTgiIGQ9Ik0wIDBoMTQ0MHY3NjhIMHoiLz48cGF0aCBkPSJNMTQ0MCA3NjhIMFYwaDEyODBDMTI4MCA0MjQuOCAxNDQwIDc2OCAxNDQwIDc2OHoiIGZpbGw9IiMxMTI4NkYiLz48L2c+PC9zdmc+')] bg-cover opacity-50"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="mb-8 flex justify-center">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-12 w-12 text-blue-300" />
                            <h1 className="ml-3 text-3xl font-bold text-white">Estacionador</h1>
                        </Link>
                    </div>

                    <div className="w-full overflow-hidden rounded-lg bg-white/10 p-2 shadow-xl backdrop-blur-sm sm:max-w-md mx-auto">
                        <div className="rounded-md bg-white/90 p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
