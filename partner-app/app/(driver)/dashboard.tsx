import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartnerTheme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(true);

    const earnings = [
        { label: 'Today', value: '₹ 1,250', count: '12 Trips' },
        { label: 'This Week', value: '₹ 8,400', count: '68 Trips' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Online Toggle */}
            <View style={styles.header}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>RK</Text>
                        <View style={[styles.statusDot, { backgroundColor: isOnline ? PartnerTheme.success : PartnerTheme.textSecondary }]} />
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.name}>Ravi Krishna</Text>
                    </View>
                </View>
                <View style={[styles.toggleContainer, { backgroundColor: isOnline ? '#E8F5E9' : '#F5F5F5' }]}>
                    <Text style={[styles.toggleText, { color: isOnline ? PartnerTheme.success : PartnerTheme.textSecondary }]}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: '#767577', true: '#A5D6A7' }}
                        thumbColor={isOnline ? PartnerTheme.success : '#f4f3f4'}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Earnings Summary */}
                <View style={styles.earningsRow}>
                    {earnings.map((item, index) => (
                        <View key={index} style={styles.earningCard}>
                            <Text style={styles.earningLabel}>{item.label}</Text>
                            <Text style={styles.earningValue}>{item.value}</Text>
                            <Text style={styles.earningCount}>{item.count}</Text>
                        </View>
                    ))}
                </View>

                {/* Current Mission / New Request */}
                {isOnline && (
                    <View style={styles.requestContainer}>
                        <View style={styles.requestHeader}>
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW DELIVERY REQUEST</Text>
                            </View>
                            <Text style={styles.timer}>25s</Text>
                        </View>

                        <View style={styles.restaurantInfo}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="restaurant" size={24} color={PartnerTheme.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.resName}>Pizza Palace</Text>
                                <Text style={styles.resAddress}>123, Main Street • 1.2 km away</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.customerInfo}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF9C4' }]}>
                                <Ionicons name="location" size={24} color={PartnerTheme.secondary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.cusName}>Delivery to: Sector 45</Text>
                                <Text style={styles.cusAddress}>Flat 402, Green View Apts • 3.5 km from pickup</Text>
                            </View>
                        </View>

                        <View style={styles.payInfo}>
                            <MaterialCommunityIcons name="wallet-outline" size={20} color={PartnerTheme.success} />
                            <Text style={styles.payText}>Est. Earnings: ₹ 45.00 + Tips</Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.declineBtn}>
                                <Text style={styles.declineText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn}>
                                <Text style={styles.acceptText}>Accept & Go</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Weekly Progress */}
                <Text style={styles.sectionTitle}>Weekly Performance</Text>
                <View style={styles.performanceCard}>
                    <View style={styles.perfRow}>
                        <View style={styles.perfItem}>
                            <Text style={styles.perfValue}>4.9</Text>
                            <Text style={styles.perfLabel}>Rating</Text>
                        </View>
                        <View style={styles.perfDivider} />
                        <View style={styles.perfItem}>
                            <Text style={styles.perfValue}>98%</Text>
                            <Text style={styles.perfLabel}>Acceptance</Text>
                        </View>
                        <View style={styles.perfDivider} />
                        <View style={styles.perfItem}>
                            <Text style={styles.perfValue}>10s</Text>
                            <Text style={styles.perfLabel}>Wait Time</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Driver Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="speedometer" size={24} color={PartnerTheme.primary} />
                    <Text style={[styles.navText, { color: PartnerTheme.primary }]}>Shift</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="wallet" size={24} color={PartnerTheme.textSecondary} />
                    <Text style={styles.navText}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="star" size={24} color={PartnerTheme.textSecondary} />
                    <Text style={styles.navText}>Ratings</Text>
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
        paddingVertical: 20,
        backgroundColor: PartnerTheme.surface,
        borderBottomWidth: 1,
        borderBottomColor: PartnerTheme.border,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: PartnerTheme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    nameContainer: {
        marginLeft: 12,
    },
    greeting: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        fontWeight: '500',
    },
    name: {
        fontSize: 18,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
        gap: 8,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    earningsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    earningCard: {
        flex: 1,
        backgroundColor: PartnerTheme.surface,
        padding: 20,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    earningLabel: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        fontWeight: '600',
    },
    earningValue: {
        fontSize: 22,
        fontWeight: '900',
        color: PartnerTheme.primary,
        marginTop: 4,
    },
    earningCount: {
        fontSize: 12,
        color: PartnerTheme.success,
        fontWeight: '700',
        marginTop: 4,
    },
    requestContainer: {
        backgroundColor: PartnerTheme.surface,
        borderRadius: 28,
        padding: 24,
        marginBottom: 32,
        borderWidth: 2,
        borderColor: PartnerTheme.secondary,
        elevation: 8,
        shadowColor: PartnerTheme.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    newBadge: {
        backgroundColor: PartnerTheme.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: PartnerTheme.primary,
    },
    timer: {
        fontSize: 18,
        fontWeight: '900',
        color: PartnerTheme.primary,
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#E8E1FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 16,
        flex: 1,
    },
    resName: {
        fontSize: 16,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    resAddress: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: PartnerTheme.border,
        marginVertical: 16,
        marginLeft: 64,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cusName: {
        fontSize: 16,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    cusAddress: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        marginTop: 2,
    },
    payInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 12,
        borderRadius: 12,
        marginTop: 20,
        gap: 10,
    },
    payText: {
        fontSize: 14,
        fontWeight: '700',
        color: PartnerTheme.success,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    declineBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: PartnerTheme.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    declineText: {
        fontSize: 16,
        fontWeight: '700',
        color: PartnerTheme.textSecondary,
    },
    acceptBtn: {
        flex: 2,
        height: 56,
        borderRadius: 16,
        backgroundColor: PartnerTheme.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: PartnerTheme.text,
        marginBottom: 16,
    },
    performanceCard: {
        backgroundColor: PartnerTheme.surface,
        borderRadius: 24,
        padding: 24,
        elevation: 2,
    },
    perfRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    perfItem: {
        alignItems: 'center',
        flex: 1,
    },
    perfValue: {
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    perfLabel: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        marginTop: 4,
    },
    perfDivider: {
        width: 1,
        height: 30,
        backgroundColor: PartnerTheme.border,
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
