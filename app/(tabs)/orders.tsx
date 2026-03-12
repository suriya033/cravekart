import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { orderApi } from '../../services/api';
import { storage } from '../../services/storage';

const { width } = Dimensions.get('window');

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState('Ongoing');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        loadUserAndOrders();
    }, []);

    const loadUserAndOrders = async () => {
        try {
            const userData = await storage.getUser();
            setUser(userData);
            if (userData) {
                fetchOrders(userData.id);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading user/orders:', error);
            setLoading(false);
        }
    };

    const fetchOrders = async (userId: number) => {
        try {
            const response = await orderApi.getByCustomer(userId);
            setOrders(response.data.reverse()); // Show newest first
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (user) fetchOrders(user.id);
    };

    const filteredOrders = orders.filter(o =>
        activeTab === 'Ongoing' ? (o.status !== 'DELIVERED' && o.status !== 'CANCELLED') : (o.status === 'DELIVERED' || o.status === 'CANCELLED')
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Orders</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
                        onPress={() => setActiveTab('Ongoing')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Ongoing' && styles.activeTabText]}>Ongoing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'History' && styles.activeTab]}
                        onPress={() => setActiveTab('History')}
                    >
                        <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CraveTheme.primary} />
                }
            >
                {loading ? (
                    <ActivityIndicator size="large" color={CraveTheme.primary} style={{ marginTop: 50 }} />
                ) : !user ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Please login to see your orders</Text>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => router.push('/login' as any)}
                        >
                            <Text style={styles.loginButtonText}>Go to Login</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredOrders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="receipt" size={80} color="#E0E0E0" />
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/(tabs)' as any)}
                        >
                            <Text style={styles.browseButtonText}>Browse Food</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredOrders.map(order => (
                        <TouchableOpacity
                            key={order.id}
                            style={styles.orderCard}
                            onPress={() => router.push(`/order-detail/${order.id}` as any)}
                        >
                            <View style={styles.orderHeader}>
                                <View style={styles.restaurantInfo}>
                                    <Image
                                        source={{ uri: order.restaurant?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100' }}
                                        style={styles.resIcon}
                                    />
                                    <View>
                                        <Text style={styles.resName}>{order.restaurant?.name || 'Restaurant'}</Text>
                                        <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: order.status === 'DELIVERED' ? '#E8F5E9' : '#FFF3E0' }]}>
                                    <Text style={[styles.statusText, { color: order.status === 'DELIVERED' ? '#2E7D32' : '#EF6C00' }]}>
                                        {order.status}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.orderDivider} />

                            <View style={styles.orderItems}>
                                {order.items?.map((item: any, idx: number) => (
                                    <Text key={idx} style={styles.itemName}>
                                        • {item.dish?.name || `Dish #${item.dish?.id}`} x {item.quantity}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.orderFooter}>
                                <View>
                                    <Text style={styles.totalLabel}>Total Price</Text>
                                    <Text style={styles.totalPrice}>₹ {order.totalAmount}</Text>
                                </View>
                                <TouchableOpacity style={styles.reorderButton}>
                                    <Text style={styles.reorderText}>
                                        {activeTab === 'Ongoing' ? 'Track Order' : 'Reorder'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6FF',
    },
    header: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingBottom: 25,
        paddingTop: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1D1E',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 15,
        padding: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: '#FFF',
        elevation: 2,
    },
    tabText: {
        color: '#9BA1A6',
        fontWeight: '700',
        fontSize: 14,
    },
    activeTabText: {
        color: CraveTheme.primary,
    },
    content: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        marginRight: 12,
    },
    resName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    orderDate: {
        fontSize: 12,
        color: '#9BA1A6',
        marginTop: 2,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    orderDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 15,
    },
    orderItems: {
        marginBottom: 15,
    },
    itemName: {
        fontSize: 14,
        color: '#6A6A6A',
        marginBottom: 4,
        fontWeight: '500',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 12,
        color: '#9BA1A6',
        fontWeight: '700',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: CraveTheme.primary,
        marginTop: 2,
    },
    reorderButton: {
        backgroundColor: '#1A1D1E',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    reorderText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: '#9BA1A6',
        textAlign: 'center',
    },
    browseButton: {
        marginTop: 25,
        backgroundColor: CraveTheme.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
    },
    browseButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: '#1A1D1E',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
    },
    loginButtonText: {
        color: '#FFF',
        fontWeight: '700',
    }
});

