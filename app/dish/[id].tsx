import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { dishApi } from '../../services/api';

const { width } = Dimensions.get('window');

export default function DishDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [dish, setDish] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchDishDetails();
        }
    }, [id]);

    const fetchDishDetails = async () => {
        try {
            setLoading(true);
            const response = await dishApi.getById(id as string);
            setDish(response.data);
        } catch (error) {
            console.error('Error fetching dish details:', error);
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

    if (!dish) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.emptyText}>Dish not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const itemTotal = dish.price * quantity;
    const deliveryFee = 35;
    const taxes = Math.round(itemTotal * 0.05);
    const total = itemTotal + deliveryFee + taxes;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Large Image Header */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: dish.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' }}
                        style={styles.dishImg}
                    />
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#1A1D1E" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.wishlistBtn}>
                        <Ionicons name="heart-outline" size={24} color="#1A1D1E" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.headerInfo}>
                        <View style={styles.labelRow}>
                            <View style={styles.vegTag}>
                                <View style={styles.vegCircle} />
                                <Text style={styles.vegLabel}>VEG</Text>
                            </View>
                            <View style={styles.bestsellerTag}>
                                <Text style={styles.bestsellerText}>BESTSELLER</Text>
                            </View>
                        </View>
                        <Text style={styles.dishName}>{dish.name}</Text>
                        <Text style={styles.priceText}>₹ {dish.price}</Text>
                        <Text style={styles.descriptionText}>{dish.description}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Quantity Selector */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionTitle}>Select Quantity</Text>
                        <View style={styles.quantityWidget}>
                            <TouchableOpacity
                                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                            >
                                <Ionicons name="remove" size={20} color={quantity <= 1 ? "#CCC" : "#1A1D1E"} />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Ionicons name="add" size={20} color="#1A1D1E" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bill Details */}
                    <View style={styles.billCard}>
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
                        <View style={[styles.billRow, { marginTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 }]}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹ {total}</Text>
                        </View>
                    </View>

                    {/* Extra Info */}
                    <View style={styles.policyCard}>
                        <View style={styles.policyRow}>
                            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                            <Text style={styles.policyText}>100% Quality Assurance & Safe Delivery</Text>
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Bottom Add Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.priceLabel}>TOTAL PRICE</Text>
                    <Text style={styles.priceAmount}>₹ {total}</Text>
                </View>
                <TouchableOpacity
                    style={styles.addCartButton}
                    onPress={() => router.push('/cart' as any)}
                >
                    <Text style={styles.addCartText}>Add to Cart</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6FF',
    },
    imageWrapper: {
        height: 400,
        position: 'relative',
    },
    dishImg: {
        width: '100%',
        height: '100%',
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    wishlistBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    content: {
        padding: 25,
        backgroundColor: '#F8F6FF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
    },
    headerInfo: {
        marginTop: 10,
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    vegTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 10,
    },
    vegCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 6,
    },
    vegLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4CAF50',
    },
    bestsellerTag: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    bestsellerText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#EF6C00',
    },
    dishName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    priceText: {
        fontSize: 24,
        fontWeight: '800',
        color: CraveTheme.primary,
        marginTop: 5,
    },
    descriptionText: {
        fontSize: 15,
        color: '#6A6A6A',
        marginTop: 12,
        lineHeight: 22,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 25,
    },
    quantitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    quantityWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 5,
        elevation: 2,
    },
    qtyBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnDisabled: {
        opacity: 0.5,
    },
    qtyValue: {
        fontSize: 18,
        fontWeight: '800',
        paddingHorizontal: 20,
        color: '#1A1D1E',
    },
    billCard: {
        backgroundColor: '#FFF',
        marginTop: 30,
        borderRadius: 25,
        padding: 20,
        elevation: 2,
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
        marginBottom: 10,
    },
    billLabel: {
        fontSize: 14,
        color: '#6A6A6A',
        fontWeight: '600',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '900',
        color: CraveTheme.primary,
    },
    policyCard: {
        marginTop: 20,
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 15,
    },
    policyRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    policyText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2E7D32',
        marginLeft: 10,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        paddingBottom: 35,
    },
    priceLabel: {
        fontSize: 12,
        color: '#9BA1A6',
        fontWeight: '700',
    },
    priceAmount: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    addCartButton: {
        backgroundColor: CraveTheme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 20,
    },
    addCartText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
        marginRight: 10,
    },
    emptyText: {
        color: '#9BA1A6',
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

