import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../context/NotificationContext';
import { createProducer } from '../api/producers';
import { getCountries } from '../api/countries';

const CreateProducer = () => {
    const navigate = useNavigate();
    const [ countries, setCountries ] = useState([]);
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        contact_name: '',
        contact_phone: '',
        contact_lastname: '',
        contact_email: '',
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getCountries();
                setCountries(data);
            } catch {
                setCountries([]);
            }
        };
        fetchCountries();
    }, []);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre del fabricante es requerido';

        if (!formData.country.trim()) newErrors.country = 'El país del fabricante es requerido';

        if (!formData.address.trim()) newErrors.address = 'La direccion del fabricante es requerido';

        if (!formData.phone.trim()) newErrors.phone = 'El telefono del fabricante es requerido';

        if (!formData.email.trim()) {
            newErrors.email = 'El correo del fabricante es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Correo inválido';
        }

        if (!formData.website.trim()) newErrors.website = 'El sitio web del fabricante es requerido';

        if (!formData.contact_name.trim()) newErrors.contact_name = 'El nombre de contacto del fabricante es requerido';

        if (!formData.contact_lastname.trim()) newErrors.contact_lastname = 'El apellido de contacto del fabricante es requerido';

        if (!formData.contact_email.trim()) {
            newErrors.contact_email = 'El correo de contacto del fabricante es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
            newErrors.contact_email = 'Correo inválido';
        }

        if (!formData.contact_phone.trim()) newErrors.contact_phone = 'El telefono de contacto del fabricante es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createProducer(formData);
            navigate('/fabricantes', {
                state: {
                    showNotification: true,
                    type: 'success',
                    title: 'Fabricante creado!',
                    message: 'Fabricante creado con éxito',
                },
            });
        } catch (error) {
            showNotification('error', 'Error al crear el fabricante!', error.message);
        }


    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Crear fabricante</h1>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ingresa el nombre del fabricante" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">País</label>
                        <select data-testid="country-select" name="country" value={formData.country} onChange={handleChange} className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.country ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} placeholder="Ingresa el pais del fabricante">
                            <option value="">Selecciona un país</option>
                            {countries &&countries.map((country) => (
                                <option key={country.id} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dirección</label>
                        <input name="address" type="text" value={formData.address} onChange={handleChange} placeholder="Ingresa la dirección del fabricante" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.address ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ingresa el correo del fabricante" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Teléfono</label>
                        <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="Ingresa el telefono del fabricante" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Sitio web</label>
                        <input name="website" type="text" value={formData.website} onChange={handleChange} placeholder="Ingresa el sitio web del fabricante" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.website ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del contacto</label>
                        <input name="contact_name" type="text" value={formData.contact_name} onChange={handleChange} placeholder="Ingresa el nombre del contacto principal" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.contact_name ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.contact_name && <p className="text-red-500 text-sm">{errors.contact_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Apellido del contacto</label>
                        <input name="contact_lastname" type="text" value={formData.contact_lastname} onChange={handleChange} placeholder="Ingresa el apellido del contacto principal" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.contact_lastname ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.contact_lastname && <p className="text-red-500 text-sm">{errors.contact_lastname}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Teléfono del contacto</label>
                        <input name="contact_phone" type="text" value={formData.contact_phone} onChange={handleChange} placeholder="Ingresa el teléfono del contacto principal" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.contact_phone ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.contact_phone && <p className="text-red-500 text-sm">{errors.contact_phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Correo electrónico del contacto</label>
                        <input name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} placeholder="Ingresa el correo del contacto principal" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.contact_email ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.contact_email && <p className="text-red-500 text-sm">{errors.contact_email}</p>}
                    </div>
                </div>

                <button type="submit" className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                    Crear
                </button>
            </form>
        </>
    )
};

export default CreateProducer;