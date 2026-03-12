import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { orderApi } from '../../services/api';
import { storage } from '../../services/storage';

export default function CheckoutScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [selectedPayment, setSelectedPayment] = useState('UPI');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [items, userData] = await Promise.all([
            storage.getCart(),
            storage.getUser()
        ]);
        setCartItems(items);
        setUser(userData);
    };

    const itemTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = 35;
    const taxes = Math.round(itemTotal * 0.05);
    const total = itemTotal + deliveryFee + taxes;

    const handlePlaceOrder = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to place an order.');
            router.push('/login');
            return;
        }

        try {
            setLoading(true);
            const orderData = {
                customer: { id: user.id.toString() },
                restaurant: { id: "1" }, // Mocking restaurant ID 1
                totalAmount: total,
                status: 'PENDING',
                items: cartItems.map(item => ({
                    dish: { id: item.id.toString() },
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await orderApi.create(orderData);
            await storage.clearCart();

            router.push('/success');
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Order Failed', 'Something went wrong while placing your order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1A1D1E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review Order</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Delivery Address */}
                <View style={[styles.card, styles.addressCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="location" size={20} color={CraveTheme.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Delivery Address</Text>
                        <TouchableOpacity>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addressContent}>
                        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                        <Text style={styles.addressText}>456, Spring Valley, Silicon City, New Delhi - 110001</Text>
                        <Text style={styles.phoneText}>+91 98765 43210</Text>
                    </View>
                </View>

                {/* Items Summary */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    {cartItems.map((item, index) => (
                        <View key={item.id} style={[styles.itemRow, index === cartItems.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={styles.itemMain}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>x{item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>₹ {item.price * item.quantity}</Text>
                        </View>
                    ))}
                </View>

                {/* Payment Methods */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    {[
                        { id: 'UPI', icon: 'flash', label: 'UPI (Paytm/Google Pay)', color: '#00BAF2' },
                        { id: 'CARD', icon: 'card', label: 'Credit/Debit Card', color: '#6236FF' },
                        { id: 'COD', icon: 'cash', label: 'Cash on Delivery', color: '#4CAF50' },
                    ].map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={styles.paymentOption}
                            onPress={() => setSelectedPayment(method.id)}
                        >
                            <View style={styles.paymentLeft}>
                                <View style={[styles.methodIcon, { backgroundColor: method.color + '15' }]}>
                                    <Ionicons name={method.icon as any} size={20} color={method.color} />
                                </View>
                                <Text style={styles.methodLabel}>{method.label}</Text>
                            </View>
                            <View style={[styles.radioButton, selectedPayment === method.id && styles.radioActive]}>
                                {selectedPayment === method.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Price Breakdown */}
                <View style={styles.priceCard}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>₹ {itemTotal}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Delivery Fee</Text>
                        <Text style={styles.priceValue}>₹ {deliveryFee}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Taxes (GST 5%)</Text>
                        <Text style={styles.priceValue}>₹ {taxes}</Text>
                    </View>
                    <View style={[styles.priceRow, styles.grandTotalRow]}>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalValue}>₹ {total}</Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.footerLabel}>PAYABLE TOTAL</Text>
                    <Text style={styles.footerValue}>₹ {total}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.placeOrderBtn, loading && { opacity: 0.8 }]}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.placeOrderText}>Place Order</Text>
                            <Ionicons name="shield-checkmark" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
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
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        elevation: 1,
    },
    addressCard: {
        borderWidth: 1,
        borderColor: 'rgba(98, 54, 255, 0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8F6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    editText: {
        color: CraveTheme.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    addressContent: {
        marginLeft: 48,
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1D1E',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 13,
        color: '#6A6A6A',
        lineHeight: 18,
        marginBottom: 8,
    },
    phoneText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1D1E',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1D1E',
        marginBottom: 15,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1D1E',
    },
    itemQty: {
        fontSize: 12,
        color: '#6A6A6A',
        marginLeft: 8,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    methodLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1D1E',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: CraveTheme.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: CraveTheme.primary,
    },
    priceCard: {
        backgroundColor: '#F1EEFF',
        padding: 20,
        borderRadius: 25,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6236FF',
        fontWeight: '600',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    grandTotalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(98, 54, 255, 0.1)',
        marginBottom: 0,
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
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        paddingBottom: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    footerLabel: {
        fontSize: 12,
        color: '#9BA1A6',
        fontWeight: '700',
    },
    footerValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    placeOrderBtn: {
        backgroundColor: CraveTheme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 20,
        minWidth: 160,
    },
    placeOrderText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});

