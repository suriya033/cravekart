import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CraveTheme } from '../constants/theme';
import { authApi } from '../services/api';
import { storage } from '../services/storage';

const IMAGE_URL = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await authApi.register({ name, email, password });
            await storage.saveUser(response.data);
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'Great!', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error: any) {
            console.error('Signup failed:', error);
            Alert.alert('Signup Failed', 'Could not create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
                <ImageBackground source={{ uri: IMAGE_URL }} style={styles.headerImage}>
                    <View style={styles.overlay} />
                    <View style={styles.headerContent}>
                        <Text style={styles.appName}>CraveKart</Text>
                        <Text style={styles.tagline}>Taste the Excellence</Text>
                    </View>
                </ImageBackground>

                <View style={styles.formContainer}>
                    <View style={styles.welcomeInfo}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join our community of food lovers</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={CraveTheme.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#9BA1A6"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={CraveTheme.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#9BA1A6"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={CraveTheme.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#9BA1A6"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.signupButton, loading && { opacity: 0.8 }]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login' as any)}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    headerImage: {
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(98, 54, 255, 0.45)',
    },
    headerContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    appName: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginTop: 5,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: -40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    welcomeInfo: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1D1E',
    },
    subtitle: {
        fontSize: 15,
        color: '#6A6A6A',
        marginTop: 5,
    },
    inputGroup: {
        marginBottom: 30,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F6FF',
        borderRadius: 18,
        paddingHorizontal: 20,
        height: 64,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#1A1D1E',
        fontWeight: '600',
    },
    signupButton: {
        backgroundColor: CraveTheme.primary,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: CraveTheme.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    footerText: {
        color: '#6A6A6A',
        fontSize: 14,
    },
    loginLink: {
        color: CraveTheme.primary,
        fontWeight: '800',
        fontSize: 14,
    },
});

