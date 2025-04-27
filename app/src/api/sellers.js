import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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

export const getSalesPlanBySeller = async (sellerId) => {
    try {
        const response = await axios.get(`${API_URL}/sellers/${sellerId}/sales-plans`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data.data;
    } catch (error) {
        return [];
    }
}

export const createSalesPlanBySeller = async (sellerId, salesPlanData) => {
    console.log("salesPlandat", salesPlanData);
    salesPlanData["sales_goals"] = parseInt(salesPlanData["sales_goals"]);
    try {
        const response = await axios.post(
            `${API_URL}/sellers/${sellerId}/sales-plans`, 
            salesPlanData,
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
}