import { NavLink, Link } from "react-router";
import { UsersIcon } from "@heroicons/react/24/solid";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { CubeIcon } from "@heroicons/react/24/solid";
import { MapIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-[#033649] text-white flex flex-col">
            <Link to="/">
                <h2 className="text-3xl font-bold text-center p-3 border-b border-white/10 h-[65px] max-h-[65px]">CCP</h2>
            </Link>
            <nav className="flex-1 p-4 space-y-5 text-sm">
                <NavLink to="/" className="flex items-center gap-2 hover:text-gray-300">
                    <UsersIcon className="w-5 h-5"/> Fabricantes
                </NavLink>
                <NavLink to="/vendedores" className="flex items-center gap-2 hover:text-gray-300">
                    <BuildingStorefrontIcon className="w-5 h-5"/> Vendedores
                </NavLink>
                <NavLink to="/productos" className="flex items-center gap-2 hover:text-gray-300">
                    <CubeIcon className="w-5 h-5"/> Productos
                </NavLink>
                <NavLink to="/" className="flex items-center gap-2 hover:text-gray-300">
                    <MapIcon className="w-5 h-5"/> Rutas de entrega
                </NavLink>
            </nav>
        </aside>
    );
}