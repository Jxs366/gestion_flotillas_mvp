// src/hooks/useUserStatus.js
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

export function useUserStatusCheck() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const segments = useSegments();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const checkStatus = async () => {
      // Evitamos checar si ya estamos en la pantalla de denegado
      const inDeniedScreen = segments[0] === 'access-denied';
      if (inDeniedScreen) return;

      try {
        setIsChecking(true);
        const token = await getToken();
        
        // Usamos tu ID de usuario de Clerk para buscar en tu BD
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          }
        });

        if (res.ok) {
          const userData = await res.json();
          
          // LÓGICA DE BLOQUEO
          // Si es driver Y su estado es inactivo
          if (userData.role === 'driver' && userData.driver_status === 'inactive') {
            router.replace("/access-denied");
          }
        }
      } catch (error) {
        console.error("Error verificando estado:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [isLoaded, isSignedIn, segments]); // Se ejecuta al navegar o cambiar auth
}