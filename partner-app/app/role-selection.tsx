import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartnerTheme } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function RoleSelection() {
    const router = useRouter();

    const handleRoleSelect = (role: 'restaurant' | 'driver') => {
        // In a real app, you'd store this in context or storage
        router.push({
            pathname: '/login',
            params: { role }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.brandText}>Partner Portal</Text>
                    <Text style={styles.subText}>Please select your role to continue</Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.roleCard}
                        onPress={() => handleRoleSelect('restaurant')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E8E1FF' }]}>
                            <Ionicons name="restaurant" size={40} color={PartnerTheme.primary} />
                        </View>
                        <View style={styles.roleInfo}>
                            <Text style={styles.roleTitle}>Restaurant Owner</Text>
                            <Text style={styles.roleDesc}>Manage your menu, track orders and grow your business.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PartnerTheme.border} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.roleCard}
                        onPress={() => handleRoleSelect('driver')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FFF9C4' }]}>
                            <Ionicons name="bicycle" size={40} color={PartnerTheme.secondary} />
                        </View>
                        <View style={styles.roleInfo}>
                            <Text style={styles.roleTitle}>Delivery Partner</Text>
                            <Text style={styles.roleDesc}>Pick up orders and deliver joy to customers across the city.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PartnerTheme.border} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>By continuing, you agree to our</Text>
                <TouchableOpacity>
                    <Text style={styles.linkText}>Terms of Service & Privacy Policy</Text>
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
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: 20,
        color: PartnerTheme.textSecondary,
        fontWeight: '500',
    },
    brandText: {
        fontSize: 36,
        fontWeight: '900',
        color: PartnerTheme.primary,
        marginTop: 4,
    },
    subText: {
        fontSize: 16,
        color: PartnerTheme.textSecondary,
        marginTop: 12,
    },
    optionsContainer: {
        gap: 20,
    },
    roleCard: {
        backgroundColor: PartnerTheme.surface,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleInfo: {
        flex: 1,
        marginLeft: 20,
        marginRight: 10,
    },
    roleTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: PartnerTheme.text,
    },
    roleDesc: {
        fontSize: 13,
        color: PartnerTheme.textSecondary,
        marginTop: 6,
        lineHeight: 18,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: PartnerTheme.textSecondary,
    },
    linkText: {
        fontSize: 13,
        color: PartnerTheme.primary,
        fontWeight: '700',
        marginTop: 4,
    }
});
