import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CraveTheme } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SuccessScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Success Illustration / Image */}
            <View style={styles.header}>
                <View style={styles.imageOverlay} />
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1540333333333-333333333333?auto=format&fit=crop&q=80&w=800' }}
                    style={styles.headerImage}
                />
            </View>

            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark" size={50} color="#FFF" />
                    </View>
                </View>

                <Text style={styles.title}>Order Placed Successfully!</Text>
                <Text style={styles.subtitle}>
                    Your food is being prepared with love. It will reach your doorstep shortly.
                </Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={24} color={CraveTheme.primary} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Estimated Delivery</Text>
                            <Text style={styles.infoValue}>25 - 35 Minutes</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={() => router.replace('/(tabs)/orders' as any)}
                    >
                        <Text style={styles.trackButtonText}>Track My Order</Text>
                        <Ionicons name="map-outline" size={20} color="#FFF" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.homeButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CraveTheme.primary,
    },
    header: {
        height: height * 0.45,
        width: '100%',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(98, 54, 255, 0.4)',
        zIndex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: -40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
        alignItems: 'center',
        zIndex: 2,
    },
    iconWrapper: {
        marginTop: -65,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 60,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1A1D1E',
        textAlign: 'center',
        marginTop: 25,
    },
    subtitle: {
        fontSize: 15,
        color: '#6A6A6A',
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 15,
        paddingHorizontal: 20,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#F8F6FF',
        padding: 20,
        borderRadius: 25,
        marginTop: 40,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoTextContainer: {
        marginLeft: 15,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9BA1A6',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
        marginTop: 2,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 20,
    },
    trackButton: {
        backgroundColor: CraveTheme.primary,
        flexDirection: 'row',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    trackButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    homeButton: {
        marginTop: 15,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#6A6A6A',
        fontSize: 16,
        fontWeight: '700',
    },
});

