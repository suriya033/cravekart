import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { dishApi, restaurantApi } from '../../services/api';
import { storage } from '../../services/storage';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: '1', name: 'Pizza', icon: 'pizza' },
    { id: '2', name: 'Burger', icon: 'fast-food' },
    { id: '3', name: 'Sushi', icon: 'fish' },
    { id: '4', name: 'Dessert', icon: 'ice-cream' },
    { id: '5', name: 'Drinks', icon: 'beer' },
];

export default function HomeScreen() {
    const router = useRouter();
    const [dishes, setDishes] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadCartCount();
        }, [])
    );

    const loadCartCount = async () => {
        const cart = await storage.getCart();
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dishesRes, restaurantsRes] = await Promise.all([
                dishApi.getAll(),
                restaurantApi.getAll()
            ]);
            setDishes(dishesRes.data);
            setRestaurants(restaurantsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleAddToCart = async (dish: any) => {
        try {
            await storage.addToCart(dish);
            setCartCount(prev => prev + 1);
            Alert.alert(
                'Added to Cart',
                `${dish.name} has been added to your cart.`,
                [
                    { text: 'Continue Shopping', style: 'cancel' },
                    { text: 'View Cart', onPress: () => router.push('/cart' as any) }
                ]
            );
        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CraveTheme.primary} />
                }
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerInfo}>
                        <Text style={styles.greeting}>Hey! 👋</Text>
                        <Text style={styles.location}>Deliver to Office 📍</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                {/* Promo Card */}
                <View style={styles.promoContainer}>
                    <LinearGradient
                        colors={['#6236FF', '#7A54FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.promoCard}
                    >
                        <View style={styles.promoContent}>
                            <Text style={styles.promoTitle}>Get 50% Off</Text>
                            <Text style={styles.promoSubtitle}>On your first order today!</Text>
                            <TouchableOpacity style={styles.promoButton}>
                                <Text style={styles.promoButtonText}>Order Now</Text>
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' }}
                            style={styles.promoImage}
                        />
                    </LinearGradient>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={20} color="#9BA1A6" />
                        <TextInput
                            placeholder="Find your favorite food..."
                            placeholderTextColor="#9BA1A6"
                            style={styles.searchInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                            <View style={styles.categoryIconContainer}>
                                <Ionicons name={cat.icon as any} size={28} color={CraveTheme.primary} />
                            </View>
                            <Text style={styles.categoryName}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Popular Restaurants */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Restaurants</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.restaurantsContainer}>
                    {loading ? (
                        <ActivityIndicator style={{ padding: 20 }} />
                    ) : restaurants.length === 0 ? (
                        <Text style={styles.emptyText}>No restaurants found</Text>
                    ) : (
                        restaurants.map((res) => (
                            <TouchableOpacity
                                key={res.id}
                                style={styles.restaurantCard}
                                onPress={() => router.push(`/restaurant/${res.id}` as any)}
                            >
                                <Image source={{ uri: res.image }} style={styles.resImage} />
                                <View style={styles.resInfo}>
                                    <Text style={styles.resName}>{res.name}</Text>
                                    <View style={styles.resMeta}>
                                        <Ionicons name="star" size={14} color={CraveTheme.yellow} />
                                        <Text style={styles.resRating}>{res.rating}</Text>
                                        <Text style={styles.resDot}>•</Text>
                                        <Text style={styles.resTime}>25-30 min</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* Popular Dishes */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Dishes</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>
                <View style={styles.dishesGrid}>
                    {loading ? (
                        <ActivityIndicator style={{ padding: 20 }} />
                    ) : dishes.length === 0 ? (
                        <Text style={styles.emptyText}>No dishes found</Text>
                    ) : (
                        dishes.map((dish) => (
                            <TouchableOpacity
                                key={dish.id}
                                style={styles.dishCard}
                                onPress={() => router.push(`/dish/${dish.id}` as any)}
                            >
                                <Image source={{ uri: dish.image }} style={styles.dishImage} />
                                <TouchableOpacity style={styles.wishlistButton}>
                                    <Ionicons name="heart-outline" size={18} color={CraveTheme.white} />
                                </TouchableOpacity>
                                <View style={styles.dishInfo}>
                                    <Text style={styles.dishName} numberOfLines={1}>{dish.name}</Text>
                                    <View style={styles.dishFooter}>
                                        <Text style={styles.dishPrice}>₹{dish.price}</Text>
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(dish);
                                            }}
                                        >
                                            <Ionicons name="add" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {cartCount > 0 && (
                <TouchableOpacity
                    style={styles.floatingCart}
                    onPress={() => router.push('/cart' as any)}
                >
                    <View style={styles.cartInfo}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartCount}</Text>
                        </View>
                        <Text style={styles.viewCartText}>View Cart</Text>
                    </View>
                    <Ionicons name="cart" size={24} color="#FFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6FF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    headerInfo: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: '#6A6A6A',
        fontWeight: '500',
    },
    location: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D1E',
        marginTop: 2,
    },
    profileButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    promoContainer: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    promoCard: {
        borderRadius: 25,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#6236FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '900',
    },
    promoSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 15,
    },
    promoButton: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        color: '#1A1D1E',
        fontWeight: '700',
        fontSize: 12,
    },
    promoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        marginRight: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1A1D1E',
    },
    filterButton: {
        width: 55,
        height: 55,
        backgroundColor: '#6236FF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    seeAll: {
        color: '#6236FF',
        fontSize: 14,
        fontWeight: '600',
    },
    categoriesContainer: {
        paddingLeft: 20,
        marginBottom: 25,
    },
    categoryCard: {
        alignItems: 'center',
        marginRight: 20,
    },
    categoryIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 1,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6A6A6A',
    },
    restaurantsContainer: {
        paddingLeft: 20,
        marginBottom: 25,
    },
    restaurantCard: {
        width: 250,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginRight: 15,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    resImage: {
        width: '100%',
        height: 140,
    },
    resInfo: {
        padding: 12,
    },
    resName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    resMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    resRating: {
        marginLeft: 4,
        fontSize: 13,
        color: '#1A1D1E',
        fontWeight: '600',
    },
    resDot: {
        marginHorizontal: 5,
        color: '#9BA1A6',
    },
    resTime: {
        fontSize: 12,
        color: '#6A6A6A',
    },
    dishesGrid: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dishCard: {
        width: (width - 50) / 2,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 15,
        padding: 10,
        elevation: 2,
    },
    wishlistButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dishImage: {
        width: '100%',
        height: 120,
        borderRadius: 15,
        marginBottom: 10,
    },
    dishInfo: {
        paddingHorizontal: 5,
    },
    dishName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    dishFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    dishPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#6236FF',
    },
    addButton: {
        backgroundColor: '#1A1D1E',
        width: 28,
        height: 28,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        padding: 20,
        color: '#6A6A6A',
        textAlign: 'center',
    },
    floatingCart: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: CraveTheme.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 20,
        elevation: 10,
        shadowColor: CraveTheme.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    cartInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#FFF',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    badgeText: {
        color: CraveTheme.primary,
        fontSize: 12,
        fontWeight: '900',
    },
    viewCartText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});

