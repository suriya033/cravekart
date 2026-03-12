import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { storage } from '../services/storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkUserAndNavigate = async () => {
            const user = await storage.getUser();
            setTimeout(() => {
                if (user) {
                    router.replace('/(tabs)' as any);
                } else {
                    router.replace('/onboarding');
                }
            }, 3000);
        };

        checkUserAndNavigate();
    }, [router]);

    return (
        <LinearGradient
            colors={['#492B9E', '#3A1883']}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.cartContainer}>
                    {/* A simple approximation of the logo using icons */}
                    <View style={styles.steamContainer}>
                        <MaterialCommunityIcons name="weather-windy" size={32} color="#FFD54F" style={{ transform: [{ rotate: '-90deg' }], marginLeft: 15 }} />
                    </View>
                    <FontAwesome5 name="shopping-cart" size={70} color="#FFD54F" />
                </View>

                <Text style={styles.title}>CraveKart</Text>
                <Text style={styles.subtitle}>Your Cravings, Delivered</Text>

                {/* Pagination at the bottom matches the first screen in sequence, though usually onboarding step 1 */}
                <View style={styles.dots}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
            </View>

            <View style={styles.cloudsContainer}>
                {/* Lighter, larger back cloud wave */}
                <Svg height="250" width={width} viewBox="0 0 1440 320" style={[styles.svg, { bottom: 0, opacity: 0.15 }]}>
                    <Path
                        fill="#ffffff"
                        d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,176C672,181,768,171,864,154.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </Svg>
                {/* Slightly darker, lower front cloud wave */}
                <Svg height="200" width={width} viewBox="0 0 1440 320" style={[styles.svg, { bottom: -20, opacity: 0.25 }]}>
                    <Path
                        fill="#ffffff"
                        d="M0,128L60,149.3C120,171,240,213,360,202.7C480,192,600,128,720,133.3C840,139,960,213,1080,240C1200,267,1320,245,1380,234.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </Svg>
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
    content: {
        alignItems: 'center',
        zIndex: 10,
        marginTop: -80,
    },
    cartContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    steamContainer: {
        marginBottom: -10,
        alignSelf: 'flex-start',
    },
    title: {
        color: '#ffffff',
        fontSize: 44,
        fontWeight: '800',
        marginTop: 5,
        letterSpacing: 0.5,
    },
    subtitle: {
        color: '#D1C4E9',
        fontSize: 15,
        marginTop: 10,
        fontWeight: '400',
        letterSpacing: 0.4,
    },
    dots: {
        flexDirection: 'row',
        marginTop: 70,
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    cloudsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 250,
    },
    svg: {
        position: 'absolute',
    },
});
