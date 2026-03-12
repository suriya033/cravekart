import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CraveTheme } from '../../constants/theme';
import { restaurantApi } from '../../services/api';

export default function SearchScreen() {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await restaurantApi.getAll();
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredRestaurants = restaurants.filter(res =>
        res.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchRestaurants();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover New Flavors</Text>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9BA1A6" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search restaurants..."
                        placeholderTextColor="#9BA1A6"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9BA1A6" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CraveTheme.primary} />
                }
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.resultsText}>
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
                    </Text>
                    <Text style={styles.countText}>{filteredRestaurants.length} found</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={CraveTheme.primary} style={{ marginTop: 50 }} />
                ) : filteredRestaurants.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={80} color="#E0E0E0" />
                        <Text style={styles.emptyText}>No restaurants matching your search</Text>
                    </View>
                ) : (
                    filteredRestaurants.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.restaurantCard}
                            onPress={() => router.push(`/restaurant/${item.id}` as any)}
                        >
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                            <View style={styles.cardInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#FFF" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                                <View style={styles.footerRow}>
                                    <View style={styles.tag}>
                                        <Ionicons name="time-outline" size={14} color={CraveTheme.primary} />
                                        <Text style={styles.tagText}>30 min</Text>
                                    </View>
                                    <View style={[styles.tag, { marginLeft: 10 }]}>
                                        <Ionicons name="bicycle-outline" size={14} color={CraveTheme.primary} />
                                        <Text style={styles.tagText}>Free Delivery</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
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
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingBottom: 25,
        paddingTop: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1D1E',
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
        paddingHorizontal: 15,
        height: 55,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1D1E',
        fontWeight: '500',
    },
    content: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    resultsText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D1E',
    },
    countText: {
        fontSize: 14,
        color: '#6A6A6A',
        fontWeight: '600',
    },
    restaurantCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    cardInfo: {
        padding: 15,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1D1E',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFB800',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#FFF',
        fontWeight: '800',
    },
    addressText: {
        fontSize: 14,
        color: '#6A6A6A',
        marginBottom: 12,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0E6FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        color: CraveTheme.primary,
        fontWeight: '700',
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: '#9BA1A6',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

