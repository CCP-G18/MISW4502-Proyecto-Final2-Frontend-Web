import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../context/NotificationContext';
import { getProducers } from '../api/producers';
import { createProduct } from '../api/products';
import { getCategories } from '../api/categories';

const CreateProduct = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [manufactures, setManufactures] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        unit_amount: '',
        manufacturer_id: '',
        image_url: '',
        category_id: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const uploadManufactures = async () => {
            try {
                const data = await getProducers();
                setManufactures(data);
            } catch {
                setManufactures([]);
            }
        };
        const uploadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch {
                setCategories([]);
            }
        }
        uploadManufactures();
        uploadCategories();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre del producto es requerido';

        if (!formData.description.trim()) newErrors.description = 'La descripción del producto es requerida';

        if (!formData.quantity.trim()) newErrors.quantity = 'La cantidad del producto es requerido';
        if (parseInt(formData.quantity) < 0) newErrors.quantity = 'La cantidad del producto debe ser mayor a cero';

        if (!formData.unit_amount.trim()) newErrors.unit_amount = 'El valor por unidad debe ser requerido';
        if (parseInt(formData.unit_amount) < 0) newErrors.unit_amount = 'El valor por unidad debe ser mayor a cero';

        if (!formData.manufacturer_id.trim()) newErrors.manufacturer_id = 'Se debe escoger un fabricante';

        if (!formData.category_id.trim()) newErrors.category_id = 'Se debe escoger una categoria';

        if (!formData.image_url.trim()) {
            newErrors.image_url = 'El enlace de la imagen es requerido';
        } else {
            const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
            if (!urlPattern.test(formData.image_url)) {
                newErrors.image_url = 'El enlace debe ser una URL válida';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createProduct(formData);
            navigate('/productos', {
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
            <h1 className="text-xl font-bold mb-4">Crear producto individual</h1>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ingresa el nombre del producto" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <textarea name="description" type="text" value={formData.description} onChange={handleChange} placeholder="Ingresa la descripción del producto" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.description ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cantidad inicial</label>
                        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Ingresa la cantidad inicial de productos" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.quantity ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Precio unitario</label>
                        <input name="unit_amount" type="number" value={formData.unit_amount} onChange={handleChange} placeholder="Ingresa el precio unitario del producto" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.unit_amount ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.unit_amount && <p className="text-red-500 text-sm">{errors.unit_amount}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Fabricante Asociado</label>
                        <select data-testid="manufacturer-select" name="manufacturer_id" value={formData.manufacturer_id} onChange={handleChange} className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.manufacturer_id ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`}>
                            <option value="" >Fabricantes</option>
                            {manufactures.map((fab) => (
                                <option key={fab.id} value={fab.id}>{fab.name}</option>
                            ))}
                        </select>
                        {errors.manufacturer_id && <p className="text-red-500 text-sm">{errors.manufacturer_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">URL de la iamgen</label>
                        <input name="image_url" type="text" value={formData.image_url} onChange={handleChange} placeholder="Ingresa la url de la imagen del producto" className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.image_url ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} />
                        {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <select data-testid="category-select" name="category_id" value={formData.category_id} onChange={handleChange} className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.category_id ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`}>
                            <option value="" >Categorias</option>
                            {categories.map((fab) => (
                                <option key={fab.id} value={fab.id}>{fab.nombre}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                    </div>
                </div>

                <button type="submit" className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                    Crear
                </button>
            </form>
        </>
    )
};

export default CreateProduct;