import { useAuth } from "@clerk/clerk-expo";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getToken } = useAuth();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  async function loadUserDetails() {
    try {
      const token = await getToken();
      if (!token) return;
      const url = `${process.env.EXPO_PUBLIC_API_URL}/api/users/${id}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar el usuario");
      router.back();
    } finally {
      setIsLoading(false);
    }
  }

  const handleSoftDelete = () => {
    const isInactive = user.driver_status === 'inactive';
    const action = isInactive ? "Reactivar" : "Desactivar";
    const newStatus = isInactive ? "active" : "inactive";

    Alert.alert(
      `Confirmar ${action}`,
      `¿Estás seguro de que quieres ${action.toLowerCase()} a este conductor?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: `Sí, ${action.toLowerCase()}`,
          style: isInactive ? "default" : "destructive",
          onPress: () => performStatusChange(newStatus),
        },
      ]
    );
  };

  const performStatusChange = async (newStatus) => {
    try {
      const token = await getToken();
      const url = `${process.env.EXPO_PUBLIC_API_URL}/api/users/${id}/status`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      // Recargamos los datos para ver el cambio reflejado inmediatamente
      loadUserDetails();
      Alert.alert("Éxito", `Conductor actualizado a: ${newStatus.toUpperCase()}`);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cambiar el estado.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-gray-100">

        {/* --- HEADER --- */}
        <View className="bg-white px-4 py-3 flex-row items-center shadow-sm border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Detalles del Usuario</Text>
        </View>

        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">

          {/* --- TARJETA PRINCIPAL (PERFIL) --- */}
          <View className="bg-white p-6 rounded-xl mb-4 items-center shadow-sm">
            <View className="bg-gray-100 h-24 w-24 rounded-full items-center justify-center mb-3">
              <Text className="text-4xl font-bold text-gray-400">
                {user.full_name?.charAt(0) || "?"}
              </Text>
            </View>

            <Text className="text-xl font-bold text-gray-800 text-center">
              {user.full_name}
            </Text>
            <Text className="text-gray-500 mb-3">{user.email}</Text>

            {/* Badge de Rol */}
            <View className={`px-4 py-1 rounded-full ${isAdmin ? 'bg-purple-100' : 'bg-green-100'}`}>
              <Text className={`font-bold text-xs uppercase ${isAdmin ? 'text-purple-700' : 'text-green-700'}`}>
                {user.role || "DRIVER"}
              </Text>
            </View>
          </View>

          {/* --- INFORMACIÓN GENERAL --- */}
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
            <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
              <Ionicons name="information-circle" size={22} color="#888" />
              <Text className="text-gray-700 font-bold ml-2">Datos Generales</Text>
            </View>

            <View className="gap-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">ID Sistema</Text>
                <Text className="text-gray-800 font-mono text-xs">{user.id?.slice(0, 15)}...</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-500">Registrado el</Text>
                <Text className="text-gray-800 font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* --- DATOS DE CONDUCTOR (SOLO SI ES DRIVER) --- */}
          {!isAdmin && (
            <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border-l-4 border-orange-500">
              <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
                <View className="bg-orange-100 p-1.5 rounded-lg mr-2">
                  <Ionicons name="car" size={20} color="#ff6600" />
                </View>
                <Text className="text-gray-800 font-bold">Información de Conductor</Text>
              </View>

              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="text-xs text-gray-500 uppercase">Licencia</Text>
                  <Text className="text-lg font-bold text-gray-800 mt-1">
                    {user.license_number || "---"}
                  </Text>
                  {!user.license_number && (
                    <Text className="text-xs text-orange-500 mt-1 italic">Pendiente</Text>
                  )}
                </View>

                <View className="items-end">
                  <Text className="text-xs text-gray-500 uppercase">Estado</Text>
                  <View className={`mt-1 px-3 py-1 rounded-full ${user.driver_status === 'active' ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <Text className={`text-xs font-bold ${user.driver_status === 'active' ? 'text-green-700' : 'text-gray-600'}`}>
                      {(user.driver_status || "inactivo").toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-xs text-gray-500 uppercase">Teléfono</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="call" size={16} color="#666" style={{ marginRight: 6 }} />
                  <Text className="text-base text-gray-800">
                    {user.phone || "No registrado"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Botones de Acción*/}
          {!isAdmin && (
            <TouchableOpacity
              onPress={handleSoftDelete}
              className={`p-4 rounded-xl flex-row items-center justify-center border mt-2 mb-6 ${user.driver_status === 'inactive'
                ? 'bg-white border-green-100'
                : 'bg-white border-red-100'
                }`}
            >
              <Ionicons
                name={user.driver_status === 'inactive' ? "refresh-outline" : "ban-outline"}
                size={20}
                color={user.driver_status === 'inactive' ? "#10b981" : "#ff3b30"}
              />
              <Text className={`font-bold ml-2 ${user.driver_status === 'inactive' ? "text-green-500" : "text-red-500"
                }`}>
                {user.driver_status === 'inactive' ? 'Reactivar Conductor' : 'Desactivar Conductor'}
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}