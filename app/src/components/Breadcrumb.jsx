import { Link, useLocation } from 'react-router';

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="text-sm text-gray-700 flex items-center space-x-1">
            {location.pathname !== '/' && (
                <>
                    <Link to="/" className="hover:underline text-blue-600">Inicio</Link>
                    <span className="mx-1 text-gray-400">/</span>
                </>
            )}
            {location.pathname === '/' && (
                <span className="text-gray-700">Inicio</span>
            )}
            {pathnames.map((name, index) => {
                const isLast = index === pathnames.length - 1;

                let label = decodeURIComponent(name.charAt(0).toUpperCase() + name.slice(1));
                if (name.match(/^[0-9a-fA-F-]{36}$/)) {
                    return null;
                }
                if (name === 'planes-venta') {
                    label = 'Planes de venta';
                }
                if (name === 'vendedores') {
                    label = 'Vendedores';
                }

                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

                return (
                    <span key={index} className="flex items-center space-x-1">
                        {!isLast ? (
                            <>
                                <Link to={routeTo} className="hover:underline text-blue-600">{label}</Link>
                                <span className="text-gray-400">/</span>
                            </>
                        ) : (
                            <span className="text-gray-700">{label}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
