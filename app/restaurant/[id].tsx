import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { dishApi, restaurantApi } from '../../services/api';
import { storage } from '../../services/storage';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );

    const loadCart = async () => {
        const items = await storage.getCart();
        setCartItems(items);
    };

    const handleAddToCart = async (dish: any) => {
        try {
            await storage.addToCart(dish);
            const updated = await storage.getCart();
            setCartItems(updated);
            Alert.alert('Added to Cart', `${dish.name} added successfully!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (id) {
            fetchRestaurantDetails();
        }
    }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            setLoading(true);
            const [restRes, menuRes] = await Promise.all([
                restaurantApi.getById(id as string),
                dishApi.getByRestaurant(id as string)
            ]);
            setRestaurant(restRes.data);
            setMenuItems(menuRes.data);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={CraveTheme.primary} />
            </SafeAreaView>
        );
    }

    if (!restaurant) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.emptyText}>Restaurant not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={{ uri: restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' }}
                        style={styles.headerImage}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.headerOverlay}
                    />
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <Ionicons name="chevron-back" size={24} color="#1A1D1E" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="heart-outline" size={24} color="#1A1D1E" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Restaurant Info */}
                <View style={styles.content}>
                    <View style={styles.mainInfoCard}>
                        <View style={styles.titleRow}>
                            <Text style={styles.restaurantName}>{restaurant.name}</Text>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={14} color="#FFF" />
                                <Text style={styles.ratingValue}>{restaurant.rating}</Text>
                            </View>
                        </View>
                        <Text style={styles.addressText}>{restaurant.address}</Text>

                        <View style={styles.divider} />

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="time-outline" size={18} color={CraveTheme.primary} />
                                <Text style={styles.detailText}>25-30 min</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="bicycle-outline" size={18} color={CraveTheme.primary} />
                                <Text style={styles.detailText}>Free Delivery</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="wallet-outline" size={18} color={CraveTheme.primary} />
                                <Text style={styles.detailText}>₹ 300 for two</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Section */}
                    <View style={styles.menuSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Menu Items</Text>
                            <Text style={styles.itemsCount}>{menuItems.length} items</Text>
                        </View>

                        {menuItems.length === 0 ? (
                            <View style={styles.emptyMenu}>
                                <Ionicons name="restaurant-outline" size={50} color="#E0E0E0" />
                                <Text style={styles.emptyText}>No items available yet</Text>
                            </View>
                        ) : (
                            menuItems.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.menuItemCard}
                                    onPress={() => router.push(`/dish/${item.id}` as any)}
                                >
                                    <View style={styles.itemInfo}>
                                        <View style={styles.vegIndicator}>
                                            <View style={styles.vegDot} />
                                        </View>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>₹ {item.price}</Text>
                                        <Text style={styles.itemDesc} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    </View>
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => handleAddToCart(item)}
                                        >
                                            <Text style={styles.addButtonText}>ADD</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Float Cart Button */}
            {cartCount > 0 && (
                <TouchableOpacity
                    style={styles.floatCart}
                    onPress={() => router.push('/cart' as any)}
                >
                    <View style={styles.floatCartContent}>
                        <View>
                            <Text style={styles.cartCount}>{cartCount} ITEMS</Text>
                            <Text style={styles.cartTotal}>₹ {cartTotal} | View Cart</Text>
                        </View>
                        <Ionicons name="cart" size={24} color="#FFF" />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6FF',
    },
    headerImageContainer: {
        height: 300,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    headerActions: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: -40,
    },
    mainInfoCard: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1D1E',
        flex: 1,
        marginRight: 10,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    ratingValue: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 14,
        marginLeft: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6A6A6A',
        marginTop: 8,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 15,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 12,
        color: '#1A1D1E',
        fontWeight: '700',
        marginLeft: 6,
    },
    menuSection: {
        marginTop: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    itemsCount: {
        fontSize: 14,
        color: '#9BA1A6',
        fontWeight: '600',
    },
    menuItemCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 15,
        marginBottom: 20,
        elevation: 2,
    },
    itemInfo: {
        flex: 1,
        paddingRight: 15,
    },
    vegIndicator: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
    },
    itemName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: CraveTheme.primary,
        marginTop: 4,
    },
    itemDesc: {
        fontSize: 13,
        color: '#6A6A6A',
        marginTop: 8,
        lineHeight: 18,
    },
    imageContainer: {
        width: 120,
        height: 120,
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: -10,
        alignSelf: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 25,
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    addButtonText: {
        color: '#4CAF50',
        fontWeight: '900',
        fontSize: 14,
    },
    floatCart: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#6236FF',
        borderRadius: 20,
        padding: 15,
        elevation: 10,
        shadowColor: '#6236FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    floatCartContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartCount: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '700',
    },
    cartTotal: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
    },
    emptyMenu: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#9BA1A6',
        marginTop: 10,
        fontSize: 16,
    },
    backLink: {
        marginTop: 20,
    },
    backLinkText: {
        color: CraveTheme.primary,
        fontWeight: 'bold',
    }
});

