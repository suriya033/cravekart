import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="dish/[id]" />
      <Stack.Screen name="cart/index" />
      <Stack.Screen name="checkout/index" />
      <Stack.Screen name="success" />
      <Stack.Screen name="order-detail/[id]" />
    </Stack>
  );
}
