import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartnerTheme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function DeliveryScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Map Placeholder */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1548345666-a57139a3a921?auto=format&fit=crop&q=80&w=800' }}
                    style={styles.mapImg}
                />

                {/* Top Floating Header */}
                <SafeAreaView style={styles.topHeader}>
                    <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={PartnerTheme.text} />
                    </TouchableOpacity>
                    <View style={styles.statusFloat}>
                        <Text style={styles.statusFloatText}>Heading to Pickup</Text>
                    </View>
                </SafeAreaView>

                {/* Floating Destination Marker */}
                <View style={styles.markerContainer}>
                    <View style={styles.markerPulse} />
                    <View style={styles.markerCircle}>
                        <Ionicons name="restaurant" size={24} color="#FFF" />
                    </View>
                </View>
            </View>

            {/* Persistent Bottom Card */}
            <View style={styles.bottomCard}>
                <View style={styles.dragHandle} />

                <View style={styles.pickupHeader}>
                    <View style={styles.resLogo}>
                        <Text style={styles.resLogoText}>PP</Text>
                    </View>
                    <View style={styles.pickupMeta}>
                        <Text style={styles.resName}>Pizza Palace</Text>
                        <Text style={styles.distText}>1.2 km • 4 mins away</Text>
                    </View>
                    <TouchableOpacity style={styles.callBtn}>
                        <Ionicons name="call" size={24} color={PartnerTheme.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderSummary}>
                    <Text style={styles.orderLabel}>Order #45681</Text>
                    <Text style={styles.orderItems}>2x Farmhouse Pizza, 1x Water Bottle</Text>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.secondaryAction}>
                        <MaterialCommunityIcons name="navigation-variant" size={24} color={PartnerTheme.primary} />
                        <Text style={styles.secondaryText}>Navigate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryAction}>
                        <Text style={styles.primaryText}>Confirm Pickup</Text>
                        <Ionicons name="chevron-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mapContainer: {
        flex: 1,
    },
    mapImg: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    topHeader: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    floatBtn: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    statusFloat: {
        backgroundColor: PartnerTheme.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        elevation: 5,
    },
    statusFloatText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 14,
    },
    markerContainer: {
        position: 'absolute',
        top: height / 3,
        left: width / 2 - 25,
        alignItems: 'center',
    },
    markerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: PartnerTheme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
        elevation: 10,
    },
    markerPulse: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: PartnerTheme.primary,
        opacity: 0.2,
    },
    bottomCard: {
        backgroundColor: PartnerTheme.surface,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 24,
        paddingBottom: 40,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: PartnerTheme.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    pickupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    resLogo: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: PartnerTheme.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resLogoText: {
        fontSize: 18,
        fontWeight: '900',
        color: PartnerTheme.primary,
    },
    pickupMeta: {
        flex: 1,
        marginLeft: 16,
    },
    resName: {
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    distText: {
        fontSize: 14,
        color: PartnerTheme.textSecondary,
        marginTop: 2,
        fontWeight: '600',
    },
    callBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PartnerTheme.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: PartnerTheme.border,
        marginBottom: 20,
    },
    orderSummary: {
        marginBottom: 32,
    },
    orderLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: PartnerTheme.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    orderItems: {
        fontSize: 16,
        color: PartnerTheme.text,
        fontWeight: '600',
        lineHeight: 24,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
    },
    secondaryAction: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        backgroundColor: PartnerTheme.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryText: {
        fontSize: 16,
        fontWeight: '700',
        color: PartnerTheme.primary,
    },
    primaryAction: {
        flex: 2,
        height: 60,
        borderRadius: 20,
        backgroundColor: PartnerTheme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 5,
    },
    primaryText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    }
});
