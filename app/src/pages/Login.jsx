import { UserIcon } from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/solid";

const Login = () => {
    return (
        <>
            <section className="w-full max-w-xs md:max-w-md mb-10" aria-label="Formulario de inicio de sesión">
                <div className="border border-gray-500 rounded-sm">
                    <header className="w-full bg-[#033649] text-white p-4 text-center text-xl font-semibold" aria-label="Encabezado del formulario de inicio de sesión">
                        <h2>Login</h2>
                    </header>
                    <main className="p-5">
                        <form>
                            <label htmlFor="username" className="block font-medium">Usuario</label>
                            <div className="relative">
                                <input id="username" type="text" placeholder="Ingresa tu usuario o correo electrónico" className="w-full pl-10 p-2 border border-gray-400 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]" />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <UserIcon className="w-5 text-black" />
                                </span>
                            </div>

                            <label htmlFor="password" className="block font-medium mt-3">Contraseña</label>
                            <div className="relative">
                                <input id="password" type="password" placeholder="Ingresa tu contraseña" className="w-full pl-10 p-2 border border-gray-400 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]" />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <LockClosedIcon className="w-5 text-black" />
                                </span>
                            </div>


                            <button type="submit" className="bg-[var(--color-secondary)] text-white p-2 mt-6 w-full rounded font-semibold" aria-label="Iniciar sesión">
                                Iniciar sesión
                            </button>
                        </form>
                    </main>
                </div>
            </section>
        </>
    );
};
  
export default Login;