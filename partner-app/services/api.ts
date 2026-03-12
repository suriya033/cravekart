import axios from 'axios';

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
    create: (data: any) => api.post('/restaurants', data),
};

export const dishApi = {
    getByRestaurant: (restaurantId: string | number) => api.get(`/dishes/restaurant/${restaurantId}`),
    create: (dishData: any) => api.post('/dishes', dishData),
};

export const orderApi = {
    getByRestaurant: (restaurantId: string | number) => api.get(`/orders/restaurant/${restaurantId}`),
    updateStatus: (orderId: string | number, status: string) => api.patch(`/orders/${orderId}`, { status }),
};
