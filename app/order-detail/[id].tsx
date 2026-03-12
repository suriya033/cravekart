import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { orderApi } from '../../services/api';

export default function OrderDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getById(id as string);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
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

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>Order not found</Text>
            </SafeAreaView>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return '#4CAF50';
            case 'CANCELLED': return '#FF4B3A';
            case 'PLACED': return '#6236FF';
            default: return '#FFB800';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1A1D1E" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Order ID: #{order.id}</Text>
                    <Text style={styles.headerSubtitle}>Placed on {new Date().toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity style={styles.helpButton}>
                    <Text style={styles.helpText}>Help</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Status Card */}
                <View style={styles.card}>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                        </View>
                        <Text style={styles.deliveryEstimate}>Arriving in 25 mins</Text>
                    </View>

                    {/* Timeline Tracker */}
                    <View style={styles.timeline}>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineIcon, { backgroundColor: CraveTheme.primary }]}>
                                <Ionicons name="checkmark" size={14} color="#FFF" />
                            </View>
                            <Text style={styles.timelineText}>Order Placed</Text>
                        </View>
                        <View style={styles.timelineLine} />
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineIcon, { backgroundColor: '#E8E1FF' }]}>
                                <View style={styles.dot} />
                            </View>
                            <Text style={styles.timelineText}>Preparing</Text>
                        </View>
                        <View style={[styles.timelineLine, { backgroundColor: '#EEE' }]} />
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineIcon, { backgroundColor: '#F3F4F6' }]}>
                                <View style={[styles.dot, { backgroundColor: '#9BA1A6' }]} />
                            </View>
                            <Text style={[styles.timelineText, { color: '#9BA1A6' }]}>On the way</Text>
                        </View>
                    </View>
                </View>

                {/* Items Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Items from {order.restaurant?.name || "Flavor Fusion"}</Text>
                    {order.items?.map((item: any, index: number) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemMain}>
                                <View style={styles.vegIndicator} />
                                <Text style={styles.itemName}>
                                    {item.dish?.name || `Dish #${item.dish?.id}`}
                                    <Text style={styles.itemQty}> x{item.quantity}</Text>
                                </Text>
                            </View>
                            <Text style={styles.itemPrice}>₹ {item.price * item.quantity}</Text>
                        </View>
                    ))}

                    <View style={styles.billSummary}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹ {order.totalAmount - 55}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Fee & Taxes</Text>
                            <Text style={styles.billValue}>₹ 55</Text>
                        </View>
                        <View style={[styles.billRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }]}>
                            <Text style={styles.totalLabel}>Total Amount Paid</Text>
                            <Text style={styles.totalValue}>₹ {order.totalAmount}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Delivery Details</Text>
                    <View style={styles.deliveryInfo}>
                        <Ionicons name="location-outline" size={20} color="#6A6A6A" />
                        <Text style={styles.addressText}>456, Spring Valley, Silicon City, New Delhi - 110001</Text>
                    </View>
                    <View style={[styles.deliveryInfo, { marginTop: 15 }]}>
                        <Ionicons name="person-outline" size={20} color="#6A6A6A" />
                        <View style={styles.agentInfo}>
                            <Text style={styles.agentName}>Rahul Sharma</Text>
                            <Text style={styles.agentSub}>Your Delivery Partner</Text>
                        </View>
                        <TouchableOpacity style={styles.callButton}>
                            <Ionicons name="call" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.reorderButton}>
                    <MaterialCommunityIcons name="refresh" size={20} color="#FFF" />
                    <Text style={styles.reorderText}>Reorder Now</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 5,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#9BA1A6',
        fontWeight: '600',
    },
    helpButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F8F6FF',
    },
    helpText: {
        color: CraveTheme.primary,
        fontWeight: '700',
        fontSize: 13,
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
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '900',
    },
    deliveryEstimate: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    timeline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    timelineItem: {
        alignItems: 'center',
    },
    timelineIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CraveTheme.primary,
    },
    timelineText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    timelineLine: {
        flex: 1,
        height: 2,
        backgroundColor: CraveTheme.primary,
        marginTop: -20,
        marginHorizontal: -5,
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
        marginBottom: 12,
    },
    itemMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vegIndicator: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1D1E',
    },
    itemQty: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    billSummary: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: {
        fontSize: 13,
        color: '#6A6A6A',
    },
    billValue: {
        fontSize: 13,
        color: '#1A1D1E',
        fontWeight: '600',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '900',
        color: CraveTheme.primary,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 13,
        color: '#6A6A6A',
        lineHeight: 18,
    },
    agentInfo: {
        flex: 1,
        marginLeft: 15,
    },
    agentName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    agentSub: {
        fontSize: 11,
        color: '#9BA1A6',
    },
    callButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        paddingBottom: 35,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    reorderButton: {
        backgroundColor: CraveTheme.primary,
        height: 56,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reorderText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        marginLeft: 10,
    },
    errorText: {
        color: '#9BA1A6',
    }
});

