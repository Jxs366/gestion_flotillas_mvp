import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'; // O tu ruta de tokenCache
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import '../../global.css';

// Tu llave pública de Clerk (asegúrate de tenerla en .env o hardcoded para pruebas)
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Componente auxiliar para manejar la navegación
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // Si está logueado y está en (auth), mandarlo a (tabs)/home
      router.replace('/(tabs)/(home)');
    } else if (!isSignedIn && !inAuthGroup) {
      // Si NO está logueado y NO está en (auth), mandarlo a login
      // Esto desmonta los Tabs porque sale de la carpeta (tabs)
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, segments, isLoaded]); // Se ejecuta cada vez que cambia el estado de auth

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}