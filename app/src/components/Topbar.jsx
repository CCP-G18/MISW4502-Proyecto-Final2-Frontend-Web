import { Link } from "react-router";
import Breadcrumb from "./Breadcrumb";

export default function Topbar() {
    return (
        <header className="flex items-center justify-between bg-gray-100 px-6 py-4 border-b h-[65px] max-h-[65px]">
            <Breadcrumb />
            <div className="flex items-center gap-4">
                <img src="https://flagcdn.com/co.svg" alt="Colombia" className="w-5 h-5 rounded-full object-cover" />
                <img src="https://flagcdn.com/us.svg" alt="USA" className="w-5 h-5 rounded-full object-cover" />
                <Link to="/logout" className="text-sm text-gray-700 hover:underline">Cerrar sesión</Link>
            </div>
        </header>
    );
}