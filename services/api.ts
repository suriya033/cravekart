import axios from 'axios';

// Replace with your local IP address for physical device testing
// Android Emulator uses 10.0.2.2 to access localhost
const BASE_URL = 'http://10.219.254.154:8080/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (userData: any) => api.post('/auth/register', userData),
};

export const restaurantApi = {
    getAll: () => api.get('/restaurants'),
    getById: (id: string | number) => api.get(`/restaurants/${id}`),
};

export const dishApi = {
    getAll: () => api.get('/dishes'),
    getById: (id: string | number) => api.get(`/dishes/${id}`),
    getByRestaurant: (restaurantId: string | number) => api.get(`/dishes/restaurant/${restaurantId}`),
};

export const orderApi = {
    create: (orderData: any) => api.post('/orders', orderData),
    getById: (id: string | number) => api.get(`/orders/${id}`),
    getByCustomer: (customerId: string | number) => api.get(`/orders/customer/${customerId}`),
};
