import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { UserIcon } from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/solid";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert('Error en el login: ' + error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <section className="w-full max-w-xs md:max-w-md mb-10" aria-label="Formulario de inicio de sesión">
                <div className="border border-gray-500 rounded-sm">
                    <header className="w-full bg-[#033649] text-white p-4 text-center text-xl font-semibold" aria-label="Encabezado del formulario de inicio de sesión">
                        <h2>Login</h2>
                    </header>
                    <main className="p-5">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username" className="block font-medium">Usuario</label>
                            <div className="relative">
                                <input id="username" type="text" placeholder="Ingresa tu usuario o correo electrónico" className="w-full pl-10 p-2 border border-gray-400 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]" onChange={(e) => setEmail(e.target.value)} required />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <UserIcon className="w-5 text-black" />
                                </span>
                            </div>

                            <label htmlFor="password" className="block font-medium mt-3">Contraseña</label>
                            <div className="relative">
                                <input id="password" type="password" placeholder="Ingresa tu contraseña" className="w-full pl-10 p-2 border border-gray-400 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"   onChange={(e) => setPassword(e.target.value)} required />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <LockClosedIcon className="w-5 text-black" />
                                </span>
                            </div>


                            <button type="submit" className="bg-[var(--color-secondary)] text-white p-2 mt-6 w-full rounded font-semibold cursor-pointer hover:opacity-80 hover:scale-105" aria-label="Iniciar sesión">
                                {loading ? 'Cargando...' : 'Iniciar Sesión'}
                            </button>

                            {loading && <div className='mt-2'><Loader className='mt-2' text="Verificando credenciales..." /></div>}
                        </form>
                    </main>
                </div>
            </section>
        </>
    );
};
  
export default Login;