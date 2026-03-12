import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartnerTheme } from '../../constants/theme';
import { dishApi } from '../../services/api';

export default function MenuManagement() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [dishes, setDishes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Pizzas', 'Main Course', 'Sides', 'Beverages'];

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            // Assuming restaurantId is 1 for the seeded 'Butter Chicken Factory'
            const response = await dishApi.getByRestaurant(1);
            setDishes(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.dishCard}>
            <Image source={{ uri: item.image }} style={styles.dishImage} />
            <View style={styles.dishInfo}>
                <View style={styles.dishHeader}>
                    <Text style={styles.dishName}>{item.name}</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color={PartnerTheme.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.dishCategory}>{item.description}</Text>
                <View style={styles.dishFooter}>
                    <Text style={styles.dishPrice}>₹ {item.price}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={[styles.statusText, { color: PartnerTheme.success }]}>
                            Available
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={PartnerTheme.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Menu Management</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryChip, activeCategory === item && styles.activeChip]}
                            onPress={() => setActiveCategory(item)}
                        >
                            <Text style={[styles.categoryText, activeCategory === item && styles.activeText]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={PartnerTheme.primary} />
                </View>
            ) : dishes.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ textAlign: 'center', color: '#666' }}>No menu items found for this restaurant.</Text>
                </View>
            ) : (
                <FlatList
                    data={dishes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.dishList}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: PartnerTheme.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryContainer: {
        backgroundColor: PartnerTheme.surface,
        paddingVertical: 16,
    },
    categoryList: {
        paddingHorizontal: 24,
        gap: 12,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: PartnerTheme.background,
    },
    activeChip: {
        backgroundColor: PartnerTheme.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
        color: PartnerTheme.textSecondary,
    },
    activeText: {
        color: '#FFF',
    },
    dishList: {
        padding: 24,
    },
    dishCard: {
        flexDirection: 'row',
        backgroundColor: PartnerTheme.surface,
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        elevation: 2,
    },
    dishImage: {
        width: 90,
        height: 90,
        borderRadius: 15,
    },
    dishInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    dishHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dishName: {
        fontSize: 16,
        fontWeight: '700',
        color: PartnerTheme.text,
    },
    dishCategory: {
        fontSize: 12,
        color: PartnerTheme.textSecondary,
        marginTop: 2,
    },
    dishFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    dishPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: PartnerTheme.primary,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    }
});
