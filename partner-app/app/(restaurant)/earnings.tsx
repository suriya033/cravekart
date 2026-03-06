import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartnerTheme } from '../../constants/theme';

export default function EarningsScreen() {
    const router = useRouter();

    const transactions = [
        { id: '1', date: 'Today, 2:30 PM', amount: '+ ₹ 450', type: 'Order Payment', status: 'Settled' },
        { id: '2', date: 'Today, 1:15 PM', amount: '+ ₹ 210', type: 'Order Payment', status: 'Settled' },
        { id: '3', date: 'Yesterday', amount: '+ ₹ 2,450', type: 'Daily Settlement', status: 'Paid' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={PartnerTheme.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Earnings & Analytics</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Balance</Text>
                    <Text style={styles.balanceValue}>₹ 12,840.50</Text>
                    <TouchableOpacity style={styles.withdrawBtn}>
                        <Text style={styles.withdrawText}>Withdraw to Bank</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {transactions.map((tx) => (
                    <View key={tx.id} style={styles.txCard}>
                        <View style={styles.txIcon}>
                            <Ionicons name="receipt-outline" size={24} color={PartnerTheme.primary} />
                        </View>
                        <View style={styles.txInfo}>
                            <Text style={styles.txType}>{tx.type}</Text>
                            <Text style={styles.txDate}>{tx.date}</Text>
                        </View>
                        <View style={styles.txAmountContainer}>
                            <Text style={styles.txAmount}>{tx.amount}</Text>
                            <Text style={styles.txStatus}>{tx.status}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: PartnerTheme.surface,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: PartnerTheme.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
        marginLeft: 16,
    },
    scrollContent: {
        padding: 24,
    },
    summaryCard: {
        backgroundColor: PartnerTheme.primary,
        borderRadius: 28,
        padding: 30,
        alignItems: 'center',
        marginBottom: 32,
        elevation: 8,
        shadowColor: PartnerTheme.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    summaryLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: '600',
    },
    balanceValue: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: '900',
        marginTop: 8,
        marginBottom: 24,
    },
    withdrawBtn: {
        backgroundColor: PartnerTheme.secondary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
    },
    withdrawText: {
        color: PartnerTheme.primary,
        fontWeight: '800',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
        marginBottom: 20,
    },
    txCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PartnerTheme.surface,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
    },
    txIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: PartnerTheme.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txInfo: {
        flex: 1,
        marginLeft: 16,
    },
    txType: {
        fontSize: 15,
        fontWeight: '700',
        color: PartnerTheme.text,
    },
    txDate: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        marginTop: 2,
    },
    txAmountContainer: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '800',
        color: PartnerTheme.success,
    },
    txStatus: {
        fontSize: 10,
        fontWeight: '700',
        color: PartnerTheme.textSecondary,
        marginTop: 4,
        textTransform: 'uppercase',
    }
});
