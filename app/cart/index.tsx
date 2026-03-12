import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { storage } from '../../services/storage';

export default function CartScreen() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const items = await storage.getCart();
            // If empty, add mock items for demonstration if it's the first time
            if (items.length === 0) {
                const mockItems = [
                    { id: '1', name: 'Butter Naan', price: 69, quantity: 2, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=100' },
                    { id: '2', name: 'Farmhouse Pizza', price: 249, quantity: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100' }
                ];
                setCartItems(mockItems);
                await storage.saveCart(mockItems);
            } else {
                setCartItems(items);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (id: string, delta: number) => {
        const updated = cartItems.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0);

        setCartItems(updated);
        await storage.saveCart(updated);
    };

    const handleClearCart = async () => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        setCartItems([]);
                        await storage.saveCart([]);
                    }
                }
            ]
        );
    };

    const itemTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = itemTotal > 0 ? 35 : 0;
    const taxes = Math.round(itemTotal * 0.05);
    const total = itemTotal + deliveryFee + taxes;

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={CraveTheme.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1A1D1E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {cartItems.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="cart-off" size={100} color="#E0E0E0" />
                        <Text style={styles.emptyTitle}>Your cart is empty</Text>
                        <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Text style={styles.browseButtonText}>Browse Food</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Items Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Review Items</Text>
                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.cartItem}>
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>₹ {item.price}</Text>

                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() => updateQuantity(item.id, -1)}
                                            >
                                                <Ionicons name="remove" size={16} color={CraveTheme.primary} />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyText}>{item.quantity}</Text>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() => updateQuantity(item.id, 1)}
                                            >
                                                <Ionicons name="add" size={16} color={CraveTheme.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => updateQuantity(item.id, -item.quantity)}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#FF4B3A" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Offers Section */}
                        <TouchableOpacity style={styles.offerCard}>
                            <View style={styles.offerLeft}>
                                <MaterialCommunityIcons name="ticket-percent" size={24} color={CraveTheme.primary} />
                                <View style={styles.offerTextContainer}>
                                    <Text style={styles.offerTitle}>Apply Coupon</Text>
                                    <Text style={styles.offerSubtitle}>Save up to ₹100 on this order</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
                        </TouchableOpacity>

                        {/* Bill Details */}
                        <View style={styles.billDetails}>
                            <Text style={styles.billTitle}>Bill Details</Text>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Item Total</Text>
                                <Text style={styles.billValue}>₹ {itemTotal}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Delivery Fee</Text>
                                <Text style={styles.billValue}>₹ {deliveryFee}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Taxes & Charges</Text>
                                <Text style={styles.billValue}>₹ {taxes}</Text>
                            </View>
                            <View style={[styles.billRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>To Pay</Text>
                                <Text style={styles.totalValue}>₹ {total}</Text>
                            </View>
                        </View>

                        {/* Order Policy */}
                        <View style={styles.policyCard}>
                            <Ionicons name="information-circle-outline" size={20} color="#6A6A6A" />
                            <Text style={styles.policyText}>Orders cannot be cancelled once packed. Please check your items before proceeding.</Text>
                        </View>
                    </>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => router.push('/checkout' as any)}
                    >
                        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.footerPrice}>₹ {total}</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    backButton: {
        padding: 5,
    },
    clearButton: {
        padding: 5,
    },
    clearText: {
        color: '#FF4B3A',
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1D1E',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6A6A6A',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
    browseButton: {
        marginTop: 30,
        backgroundColor: CraveTheme.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 20,
    },
    browseButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
        marginBottom: 15,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 1,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 15,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    itemPrice: {
        fontSize: 14,
        color: CraveTheme.primary,
        fontWeight: '800',
        marginTop: 4,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#F8F6FF',
        alignSelf: 'flex-start',
        borderRadius: 10,
        padding: 2,
    },
    qtyBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        paddingHorizontal: 12,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    removeBtn: {
        padding: 5,
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#E8E1FF',
    },
    offerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    offerTextContainer: {
        marginLeft: 15,
    },
    offerTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    offerSubtitle: {
        fontSize: 12,
        color: '#6A6A6A',
        marginTop: 2,
    },
    billDetails: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        elevation: 1,
    },
    billTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
        marginBottom: 15,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    billLabel: {
        fontSize: 14,
        color: '#6A6A6A',
        fontWeight: '600',
    },
    billValue: {
        fontSize: 14,
        color: '#1A1D1E',
        fontWeight: '700',
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
        color: CraveTheme.primary,
    },
    policyCard: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        padding: 15,
        borderRadius: 15,
        marginTop: 20,
        alignItems: 'center',
    },
    policyText: {
        flex: 1,
        fontSize: 12,
        color: '#6A6A6A',
        marginLeft: 10,
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        paddingBottom: 35,
        elevation: 10,
    },
    checkoutButton: {
        backgroundColor: CraveTheme.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
    },
    checkoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerPrice: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
        marginRight: 10,
    },
});

