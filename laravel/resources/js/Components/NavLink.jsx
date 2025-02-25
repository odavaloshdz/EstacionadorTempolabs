import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-blue-500 text-blue-900 focus:border-blue-700'
                    : 'border-transparent text-blue-600 hover:border-blue-300 hover:text-blue-800 focus:border-blue-300 focus:text-blue-800') +
                className
            }
        >
            {children}
        </Link>
    );
}
