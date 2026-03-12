import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { storage } from '../../services/storage';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await storage.getUser();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await storage.removeUser();
        router.replace('/login' as any);
    };

    const MENU_ITEMS = [
        { icon: 'person-outline', title: 'Edit Profile', subtitle: 'Manage your account details' },
        { icon: 'location-outline', title: 'Addresses', subtitle: 'Saved shipping addresses' },
        { icon: 'card-outline', title: 'Payments', subtitle: 'Manage your payment methods' },
        { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage your alerts' },
        { icon: 'shield-checkmark-outline', title: 'Security', subtitle: 'Privacy and password' },
        { icon: 'help-circle-outline', title: 'Support', subtitle: 'FAQs and contact us' },
    ];

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={CraveTheme.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient
                        colors={['#6236FF', '#492B9E']}
                        style={styles.headerBackground}
                    />
                    <View style={styles.profileHeaderContent}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{user?.name || 'Crave User'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                    </View>
                </View>

                {/* Stats Container */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>₹ 2.4k</Text>
                        <Text style={styles.statLabel}>Spent</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Coupons</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon as any} size={22} color={CraveTheme.primary} />
                                </View>
                                <View>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#FF4B3A" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 50 }} />
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
        height: 280,
        position: 'relative',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    profileHeaderContent: {
        alignItems: 'center',
        paddingTop: 80,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFB800',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    userEmail: {
        fontSize: 14,
        color: '#6A6A6A',
        marginTop: 4,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 25,
        marginTop: -30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    statLabel: {
        fontSize: 12,
        color: '#6A6A6A',
        marginTop: 4,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#F3F4F6',
        height: '100%',
    },
    menuSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        elevation: 1,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 45,
        height: 45,
        backgroundColor: '#F0E6FF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#9BA1A6',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginTop: 10,
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFEBEA',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF4B3A',
        marginLeft: 10,
    },
});

