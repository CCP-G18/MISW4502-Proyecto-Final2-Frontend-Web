import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('token', response.data.access_token);
        return response.data;
    } catch (error) {
        console.warn('API no disponible, usando usuario estático. Error: ', error);
        if (email !== 'admin@admin.com' || password !== '123') throw 'Credenciales incorrectas';
        const staticUser = {
            access_token: 'fake-jwt-token',
            email: 'admin@admin.com',
            name: 'Admin',
        };
        localStorage.setItem('token', staticUser.access_token);
        return staticUser;
    }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};