import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data.data;
    } catch {
        return [];
    }
}

export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data.data;
    } catch {
        return [];
    }
}

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(
            `${API_URL}/products`,
            productData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
        )
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error al crear el producto';
        throw new Error(message);
    }
}

export const productUploadPreview = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await axios.post(
            `${API_URL}/products/upload-preview`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
        );
        return response;
    } catch (error) {
        const message = error.response?.data?.message || 'Error al cargar el documento';
        throw new Error(message);
    }
}

export const productsBulkSave = async (products) => {
    try {
        const response = await axios.post(
            `${API_URL}/products/bulk-save`,
            {
                "products": products
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
        )
        return response;
    } catch (error) {
        const message = error.response?.data?.error || 'Error al crear los productos';
        throw new Error(message);
    }
}