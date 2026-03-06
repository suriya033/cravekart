import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { PartnerTheme } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            router.replace('/role-selection');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={[PartnerTheme.primary, '#2E004F']}
            style={styles.container}
        >
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.iconCircle}>
                    <Ionicons name="business" size={60} color={PartnerTheme.secondary} />
                    <View style={styles.badge}>
                        <Ionicons name="flash" size={20} color={PartnerTheme.primary} />
                    </View>
                </View>
                <Text style={styles.title}>CraveKart</Text>
                <Text style={styles.subtitle}>Partner App</Text>
            </Animated.View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Empowering Food Businesses</Text>
                <View style={styles.loader} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    badge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: PartnerTheme.secondary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: PartnerTheme.primary,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: 1,
    },
    subtitle: {
        color: PartnerTheme.secondary,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 5,
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20,
    },
    loader: {
        width: 40,
        height: 4,
        backgroundColor: PartnerTheme.secondary,
        borderRadius: 2,
        opacity: 0.5,
    }
});
