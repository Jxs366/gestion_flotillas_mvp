import { useAuth } from "@clerk/clerk-expo";
import { Link, useFocusEffect } from "expo-router"; // Importamos useFocusEffect
import { useCallback, useState } from "react";      // Importamos useCallback
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Asegúrate de que la ruta a tu componente sea correcta
import UserCard from "../../components/UserCard"; 

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();

  async function loadUsers() {
    try {
      // Si es la primera carga (isLoading true), no activamos el spinner de refresh manual
      if (!isLoading) setRefreshing(true);
      
      const token = await getToken();

      if (!token) {
        setUsers([]);
        return;
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) {
        setUsers([]);
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error.message);
      setUsers([]);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }

  // ✅ USAMOS useFocusEffect PARA RECARGAR AL VOLVER A LA PANTALLA
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  /**
   * HELPER DE ESTADO
   * Lee el campo 'driver_status' que viene del LEFT JOIN en el backend.
   */
  const getUserStatus = (u) => {
    // 1. Si el campo existe (driver inactivo o activo explícito), úsalo.
    if (u.driver_status) return u.driver_status;
    
    // 2. Si viene null (Admin o driver viejo sin registro), asume activo.
    return 'active';
  };

  // Filtramos las listas
  const activeUsers = users.filter(u => getUserStatus(u) !== 'inactive');
  const inactiveUsers = users.filter(u => getUserStatus(u) === 'inactive');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="flex-1 bg-gray-50">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-32 pt-6"
          refreshControl={
            <RefreshControl
              tintColor="#ff6600"
              colors={["#ff6600"]}
              refreshing={refreshing}
              onRefresh={loadUsers}
            />
          }
        >
          {/* HEADER */}
          <View className="mb-6 px-2">
            <Text className="text-3xl font-bold text-gray-800">Usuarios</Text>
            <Text className="mt-1 text-base text-gray-500">
              Administra el acceso y roles de tu flota.
            </Text>
          </View>

          {/* LOADING & EMPTY STATES */}
          {isLoading && users.length === 0 ? (
            <View className="py-24">
              <ActivityIndicator size="large" color="#ff6600" />
            </View>
          ) : users.length === 0 ? (
            <View className="items-center justify-center py-16 opacity-50">
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text className="text-gray-400 mt-4">No hay usuarios</Text>
            </View>
          ) : (
            <View>
              {/* 1. USUARIOS ACTIVOS */}
              <View>
                {activeUsers.map((u) => (
                  <UserCard key={u.id} user={u} isInactive={false} />
                ))}
              </View>

              {/* 2. USUARIOS INACTIVOS */}
              {inactiveUsers.length > 0 && (
                <View className="mt-6">
                  <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2">
                    Inactivos ({inactiveUsers.length})
                  </Text>
                  
                  {inactiveUsers.map((u) => (
                    <UserCard key={u.id} user={u} isInactive={true} />
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* FAB (Botón Agregar) */}
        <Link href="/(tabs)/Users/register" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/40"
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
