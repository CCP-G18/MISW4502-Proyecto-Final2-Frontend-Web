import { useNavigate, useParams } from "react-router";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";
import { createSalesPlanBySeller } from "../api/sellers";


const CreateSalesPlan = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        initial_date: '',
        end_date: '',
        sales_goals: '',
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
        if (!formData.initial_date.trim()) newErrors.initial_date = 'La fecha de inicio es requerida';

        if (!formData.end_date.trim()) newErrors.end_date = 'La fecha de finalización es requerida';

        if (!formData.sales_goals.trim()) newErrors.sales_goals = 'El valor por unidad debe ser requerido';
        if (parseInt(formData.sales_goals) < 0) newErrors.sales_goals = 'El valor por unidad debe ser mayor a cero';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createSalesPlanBySeller(sellerId, formData);
            navigate(`/vendedores/planes-venta/${sellerId}`, {
                state: {
                    showNotification: true,
                    type: 'success',
                    title: 'Producto creado!',
                    message: 'Producto creado con éxito',
                },
            });
        } catch (error) {
            showNotification('error', 'Error al crear el producto!', error.message);
        }
    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Crear plan de venta</h1>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="initial_date" className="block text-sm font-medium mb-1">Fecha de inicio</label>
                        <input
                            id="initial_date"
                            name="initial_date"
                            type="date"
                            value={formData.initial_date}
                            onChange={handleChange}
                            placeholder="Selecciona la fecha de inicio"
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.initial_date
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'
                                }`}
                        />
                        {errors.initial_date && <p className="text-red-500 text-sm">{errors.initial_date}</p>}
                    </div>
                    <div>
                        <label htmlFor="end_date"  className="block text-sm font-medium mb-1">Fecha de finalización</label>
                        <input
                            id="end_date"
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={handleChange}
                            placeholder="Selecciona la fecha de finalización"
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.end_date
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'
                                }`}
                        />
                        {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
                    </div>
                    <div>
                        <label htmlFor="sales_goals" className="block text-sm font-medium mb-1">Metas de Ventas</label>
                        <input id="sales_goals" name="sales_goals" type="number" value={formData.sales_goals} onChange={handleChange} placeholder="Ingresa el precio unitario del producto" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.sales_goals ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.sales_goals && <p className="text-red-500 text-sm">{errors.sales_goals}</p>}
                    </div>
                </div>
                <button type="submit" className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                    Crear
                </button>
            </form>
        </>
    )
}

export default CreateSalesPlan;