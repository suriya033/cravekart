import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CraveTheme } from '../constants/theme';
import { authApi } from '../services/api';
import { storage } from '../services/storage';

const IMAGE_URL = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            const response = await authApi.login({ email, password });
            await storage.saveUser(response.data);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login failed:', error);
            Alert.alert('Login Failed', 'Invalid credentials or connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" translucent />
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your food journey</Text>
                    </View>

                    <View style={styles.inputGroup}>
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

                        <TouchableOpacity style={styles.forgotPass}>
                            <Text style={styles.forgotPassText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && { opacity: 0.8 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Ionicons name="logo-apple" size={24} color="#1A1D1E" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                            <Text style={styles.signupLink}>Sign Up</Text>
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
        height: 350,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(98, 54, 255, 0.45)', // CraveTheme primary with alpha
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
    forgotPass: {
        alignSelf: 'flex-end',
    },
    forgotPassText: {
        color: CraveTheme.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    loginButton: {
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
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 35,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#9BA1A6',
        fontSize: 13,
        fontWeight: '600',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
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
    signupLink: {
        color: CraveTheme.primary,
        fontWeight: '800',
        fontSize: 14,
    },
});

