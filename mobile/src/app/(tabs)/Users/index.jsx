import { useAuth } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  LayoutAnimation, // Para animación suave al abrir/cerrar
  Platform,
  UIManager
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Habilitar animaciones en Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para colapsar/expandir inactivos (Estilo WhatsApp)
  const [showInactive, setShowInactive] = useState(false);

  const { getToken } = useAuth();

  async function loadUsers() {
    try {
      setRefreshing(true);
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

  useEffect(() => {
    loadUsers();
  }, []);

  // Función para alternar la visibilidad de inactivos
  const toggleInactive = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInactive(!showInactive);
  };

  // Lógica de separación
  const activeUsers = users.filter(u => u.driver_status !== 'inactive');
  const inactiveUsers = users.filter(u => u.driver_status === 'inactive');

  // Componente para renderizar tarjeta (Reutilizable)
  const UserCard = ({ u, isInactive }) => {
    const isAdmin = u.role === "admin";
    
    return (
      <TouchableOpacity
        key={u.id}
        activeOpacity={0.7}
        onPress={() => router.push(`/Users/user-detail?id=${u.id}`)}
        className={`p-4 rounded-xl mb-3 flex-row items-center border ${
          isInactive 
            ? "bg-gray-100 border-transparent opacity-60" // Estilo Inactivo (Gris, opaco)
            : "bg-white shadow-sm border-gray-100"        // Estilo Activo (Blanco, sombra)
        }`}
      >
        {/* Avatar */}
        <View className={`h-14 w-14 rounded-full items-center justify-center mr-4 ${
          isInactive ? "bg-gray-200" : "bg-gray-100"
        }`}>
          <Text className={`text-xl font-bold ${isInactive ? "text-gray-400" : "text-gray-500"}`}>
            {u.full_name ? u.full_name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text 
              className={`text-lg font-bold flex-1 mr-2 ${isInactive ? "text-gray-500" : "text-gray-800"}`} 
              numberOfLines={1}
            >
              {u.full_name || "Sin nombre"}
            </Text>
            
            {/* Badge Rol/Estado */}
            {isInactive ? (
               <View className="bg-gray-200 px-2 py-0.5 rounded-full">
                 <Text className="text-[10px] font-bold uppercase text-gray-500">INACTIVO</Text>
               </View>
            ) : (
              <View className={`px-2 py-0.5 rounded-full ${isAdmin ? 'bg-purple-100' : 'bg-green-100'}`}>
                <Text className={`text-[10px] font-bold uppercase ${isAdmin ? 'text-purple-700' : 'text-green-700'}`}>
                  {u.role || "DRIVER"}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-gray-400 text-sm mb-1" numberOfLines={1}>
            {u.email}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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

          {/* LOADING */}
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
              {/* 1. LISTA DE USUARIOS ACTIVOS */}
              <View>
                {activeUsers.map((u) => (
                  <UserCard key={u.id} u={u} isInactive={false} />
                ))}
              </View>

              {/* 2. SECCIÓN DE INACTIVOS (Estilo WhatsApp) */}
              {inactiveUsers.length > 0 && (
                <View className="mt-4">
                  {/* Botón Colapsable */}
                  <TouchableOpacity 
                    onPress={toggleInactive}
                    className="flex-row items-center justify-between bg-gray-200/50 p-3 rounded-lg mb-2"
                  >
                    <Text className="text-gray-500 font-semibold text-sm uppercase tracking-wide ml-2">
                      Inactivos ({inactiveUsers.length})
                    </Text>
                    <Ionicons 
                      name={showInactive ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>

                  {/* Lista Oculta */}
                  {showInactive && (
                    <View className="mt-2">
                      {inactiveUsers.map((u) => (
                        <UserCard key={u.id} u={u} isInactive={true} />
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* FAB */}
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