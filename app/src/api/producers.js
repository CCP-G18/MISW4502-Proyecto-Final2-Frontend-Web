import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

export const getProducers = async () => {
    try {
        const response = await axios.get(`${API_URL}/producers`, {
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

export const createProducer = async (producerData) => {
    try {
        const response = await axios.post(
            `${API_URL}/producers`,
            producerData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,     
                }
            }
        )
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error al crear el fabricante';
        throw new Error(message);
    }
}