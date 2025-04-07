import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createSeller } from '../api/sellers';
import { useNotification } from '../context/NotificationContext';

const CreateSeller = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        assignedArea: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
        if (!formData.lastname.trim()) newErrors.lastname = 'Apellido es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'Correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Correo inválido';
        }
        if (!formData.assignedArea.trim()) newErrors.assignedArea = 'Zona asignada es requerida';
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        try {
            await createSeller(formData);
            navigate('/vendedores', {
                state: {
                    showNotification: true,
                    type: 'success',
                    title: 'Vendedor creado!',
                    message: 'Vendedor creado con éxito',
                },
            });
        } catch (error) {
            showNotification('error', 'Error al crear el vendedor!', error.message);
        }


    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Crear vendedor</h1>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ingresa el nombre del vendedor" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Apellido</label>
                        <input name="lastname" type="text" value={formData.lastname} onChange={handleChange} placeholder="Ingresa el apellido del vendedor" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.lastname ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ingresa el correo electrónico del vendedor" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Zona asignada</label>
                        <input name="assignedArea" type="text" value={formData.assignedArea} onChange={handleChange} placeholder="Ingresa la zona del vendedor" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.assignedArea ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.assignedArea && <p className="text-red-500 text-sm">{errors.assignedArea}</p>}
                    </div>
                </div>

                <button type="submit" className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                    Crear
                </button>
            </form>
        </>
    )
};
  
export default CreateSeller;