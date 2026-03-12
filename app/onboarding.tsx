import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: '1',
        title: 'Discover Your\nCravings',
        description: 'Explore a variety of delicious dishes\nfrom top restaurants near you.',
        image: 'https://cdn3d.iconscout.com/3d/premium/thumb/pizza-4994273-4159518.png',
        topColors: ['#FFEDB3', '#FFE082'], // Light yellow gradient
        buttonText: 'Next',
    },
    {
        id: '2',
        title: 'Fast Doorstep\nDelivery',
        description: 'Get your food delivered quickly\nand fresh right to your doorstep.',
        image: 'https://cdn3d.iconscout.com/3d/premium/thumb/food-delivery-scooter-4402660-3660505.png',
        topColors: ['#FFF3CD', '#FFD54F'], // Slightly more orange yellow
        buttonText: 'Next',
    },
    {
        id: '3',
        title: 'Track in\nReal-Time',
        description: 'Follow your order with live tracking\nand stay updated on its arrival.',
        image: 'https://cdn3d.iconscout.com/3d/premium/thumb/route-map-4720932-3917400.png',
        topColors: ['#F3E5F5', '#E1BEE7'], // Light purple gradient
        buttonText: 'Get Started',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        } else {
            router.replace('/login');
        }
    };

    const renderItem = ({ item, index }: { item: typeof onboardingData[0], index: number }) => {
        return (
            <View style={styles.slide}>
                {/* Top Graphical Section */}
                <LinearGradient
                    colors={item.topColors as [string, string]}
                    style={styles.topSection}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    {/* Temporary rounded rect behind illustration */}
                    <View style={styles.imageBackgroundWrapper}>
                        <View style={[styles.circleHighlight, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                    </View>
                </LinearGradient>

                {/* Bottom Text and Action Section */}
                <View style={styles.bottomSection}>
                    {/* White Wave separating the top color and bottom white area */}
                    <View style={styles.waveContainer}>
                        <Svg width={width} height={80} viewBox="0 0 1440 200" preserveAspectRatio="none">
                            <Path
                                fill="#ffffff"
                                d="M0,64L60,85.3C120,107,240,149,360,154.7C480,160,600,128,720,117.3C840,107,960,117,1080,122.7C1200,128,1320,128,1380,128L1440,128L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z"
                            />
                        </Svg>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>

                        <View style={{ flex: 1 }} />

                        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
                            <Text style={styles.buttonText}>{item.buttonText}</Text>
                        </TouchableOpacity>

                        <View style={styles.pagination}>
                            {onboardingData.map((_, i) => (
                                <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        width,
        height,
        backgroundColor: '#fff',
    },
    topSection: {
        height: height * 0.52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackgroundWrapper: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 40,
    },
    circleHighlight: {
        position: 'absolute',
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
    },
    image: {
        width: '90%',
        height: '90%',
        zIndex: 10,
    },
    bottomSection: {
        height: height * 0.48,
        backgroundColor: '#fff',
        marginTop: -40, // Pulls the white section up to overlap the wave
    },
    waveContainer: {
        position: 'absolute',
        top: -50,
        width: '100%',
        zIndex: 1,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 45,
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#321f64', // Deep purple
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 38,
    },
    description: {
        fontSize: 14,
        color: '#7B7293', // Lighter purple-grey
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '400',
        paddingHorizontal: 15,
    },
    button: {
        backgroundColor: '#FFB800', // Deep Yellow
        width: '90%',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#321f64', // Match the UI: Button text looks deep purple? Assuming dark or white. Let's look closer. Actually it's dark purple/white. Wait, the preview image Next button text is Deep Purple.
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EBE5F5',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#FFB800',
    },
});
