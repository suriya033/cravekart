import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'cravekart_user';

const CART_KEY = 'cravekart_cart';

export const storage = {
    saveUser: async (user: any) => {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user:', error);
        }
    },
    getUser: async () => {
        try {
            const user = await AsyncStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },
    removeUser: async () => {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    },
    saveCart: async (cart: any[]) => {
        try {
            await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    },
    getCart: async () => {
        try {
            const cart = await AsyncStorage.getItem(CART_KEY);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    },
    clearCart: async () => {
        try {
            await AsyncStorage.removeItem(CART_KEY);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    },
    addToCart: async (dish: any) => {
        try {
            const cart = await storage.getCart();
            const existing = cart.find((item: any) => item.id === dish.id);
            let updated;
            if (existing) {
                updated = cart.map((item: any) =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updated = [...cart, { ...dish, quantity: 1 }];
            }
            await storage.saveCart(updated);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }
};
