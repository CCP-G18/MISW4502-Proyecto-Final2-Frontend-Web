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