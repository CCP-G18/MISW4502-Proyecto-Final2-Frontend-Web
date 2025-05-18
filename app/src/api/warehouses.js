import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009';

export const getWarehousesByProduct = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/warehouses/product/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return response.data.data;
    } catch {
        return [
            {
                "place": "No location",
                "warehouse": {
                    "location": "No location",
                    "name": "No location"
                }
            }
        ];
    }
}