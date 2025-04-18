import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getSellers = async () => {
    try {
        const response = await axios.get(`${API_URL}/sellers`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data.data;
    } catch {
        return [];
    }
};

export const createSeller = async (sellerData) => {
    try {
        const response = await axios.post(
            `${API_URL}/sellers`, 
            sellerData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error al crear el vendedor';
        throw new Error(message);
    }
};