import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartnerTheme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function RestaurantDashboard() {
    const router = useRouter();

    const STATS = [
        { label: 'Today Orders', value: '24', icon: 'cart-outline', color: '#6236FF' },
        { label: 'Today Revenue', value: '₹ 8,450', icon: 'wallet-outline', color: '#27AE60' },
        { label: 'Pending', value: '5', icon: 'time-outline', color: '#F2994A' },
        { label: 'Completed', value: '18', icon: 'checkmark-circle-outline', color: '#2D9CDB' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.ownerName}>Pizza Palace</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn}>
                    <Ionicons name="notifications-outline" size={24} color={PartnerTheme.text} />
                    <View style={styles.notifBadge} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(restaurant)/menu' as any)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#E8E1FF' }]}>
                            <Ionicons name="restaurant" size={28} color={PartnerTheme.primary} />
                        </View>
                        <Text style={styles.actionText}>Menu Management</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(restaurant)/orders' as any)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF9C4' }]}>
                            <Ionicons name="receipt" size={28} color={PartnerTheme.secondary} />
                        </View>
                        <Text style={styles.actionText}>Active Orders</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Orders Preview */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Incoming Orders</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                {[1, 2, 3].map((order) => (
                    <View key={order} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <View style={styles.orderIdContainer}>
                                <Text style={styles.orderId}>#OR-5920</Text>
                                <Text style={styles.orderTime}>• 2 mins ago</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>PENDING</Text>
                            </View>
                        </View>
                        <View style={styles.orderDetails}>
                            <Text style={styles.itemsText}>2x Farmhouse Pizza, 1x Coke (500ml)</Text>
                            <Text style={styles.priceText}>Total: ₹ 650</Text>
                        </View>
                        <View style={styles.orderActions}>
                            <TouchableOpacity style={styles.rejectBtn}>
                                <Text style={styles.rejectText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn}>
                                <Text style={styles.acceptText}>Accept Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Basic Bottom Nav for Prototype */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="grid" size={24} color={PartnerTheme.primary} />
                    <Text style={[styles.navText, { color: PartnerTheme.primary }]}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(restaurant)/menu' as any)}>
                    <Ionicons name="list" size={24} color={PartnerTheme.textSecondary} />
                    <Text style={styles.navText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="stats-chart" size={24} color={PartnerTheme.textSecondary} />
                    <Text style={styles.navText}>Sales</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person" size={24} color={PartnerTheme.textSecondary} />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PartnerTheme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: PartnerTheme.surface,
    },
    welcomeText: {
        fontSize: 14,
        color: PartnerTheme.textSecondary,
        fontWeight: '500',
    },
    ownerName: {
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    profileBtn: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: PartnerTheme.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifBadge: {
        position: 'absolute',
        top: 12,
        right: 14,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: PartnerTheme.error,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        width: (width - 64) / 2,
        backgroundColor: PartnerTheme.surface,
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: PartnerTheme.text,
    },
    statLabel: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        fontWeight: '600',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
        marginBottom: 16,
    },
    viewAll: {
        fontSize: 14,
        color: PartnerTheme.primary,
        fontWeight: '700',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    actionCard: {
        flex: 1,
        backgroundColor: PartnerTheme.surface,
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 2,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: PartnerTheme.text,
        textAlign: 'center',
    },
    orderCard: {
        backgroundColor: PartnerTheme.surface,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 5,
        borderLeftColor: PartnerTheme.warning,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    orderTime: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        marginLeft: 8,
    },
    statusBadge: {
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#856404',
    },
    orderDetails: {
        marginBottom: 16,
    },
    itemsText: {
        fontSize: 14,
        color: PartnerTheme.textSecondary,
        lineHeight: 20,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '800',
        color: PartnerTheme.primary,
        marginTop: 8,
    },
    orderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    rejectBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: PartnerTheme.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectText: {
        fontSize: 14,
        fontWeight: '700',
        color: PartnerTheme.textSecondary,
    },
    acceptBtn: {
        flex: 2,
        height: 44,
        borderRadius: 12,
        backgroundColor: PartnerTheme.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        backgroundColor: PartnerTheme.surface,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: PartnerTheme.border,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
        color: PartnerTheme.textSecondary,
    }
});
