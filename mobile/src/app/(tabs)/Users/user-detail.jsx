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
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// IMPORTAR EL MODAL REUTILIZABLE
import AssignmentModal from "../../components/AssignmentModal";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getToken } = useAuth();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para manejo de vehículos
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [id]);

  async function loadAllData() {
    setIsLoading(true);
    await Promise.all([loadUserDetails(), loadDriverVehicles()]);
    setIsLoading(false);
  }

  async function loadUserDetails() {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) throw new Error("Error cargando usuario");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar el usuario");
      router.back();
    }
  }

  async function loadDriverVehicles() {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${id}/vehicles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setAssignedVehicles(data);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  }

  // Carga los vehículos disponibles y abre el modal
  async function openAssignmentModal() {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/vehicles/available`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setAvailableVehicles(data);
        setModalVisible(true);
      } else {
        Alert.alert("Error", "No se pudieron cargar vehículos disponibles");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Maneja la selección dentro del modal
  async function handleSelectVehicle(vehicle) {
    try {
      setIsAssigning(true);
      const token = await getToken();

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${id}/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ vehicleId: vehicle.id }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al asignar");
      }

      Alert.alert(
        "Éxito",
        `Se asignó el ${vehicle.brand} ${vehicle.model} correctamente.`
      );
      setModalVisible(false);
      loadDriverVehicles();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsAssigning(false);
    }
  }

  // --- LÓGICA DE DESVINCULAR ---
  const handleUnassign = (vehicleId) => {
    Alert.alert(
      "Desvincular Vehículo",
      "¿Estás seguro? El vehículo quedará sin conductor.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, desvincular",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/vehicles/unassign`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                  },
                  body: JSON.stringify({ vehicleId }),
                }
              );

              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Error al desvincular");
              }

              Alert.alert("Éxito", "Vehículo desvinculado");
              loadDriverVehicles();
            } catch (error) {
              console.error("Error en unassign:", error);
              Alert.alert("Error", "Fallo de red o servidor: " + error.message);
            }
          },
        },
      ]
    );
  };

  // --- LÓGICA DE ACTIVAR/DESACTIVAR CONDUCTOR (RESTAURADA) ---
  const handleSoftDelete = () => {
    const isInactive = user.driver_status === "inactive";
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
      // Asegúrate que esta ruta coincide con tu backend: /api/users/:id/status
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

      loadUserDetails();
      Alert.alert(
        "Éxito",
        `Conductor actualizado a: ${newStatus.toUpperCase()}`
      );
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
  const isAdmin = user.role === "admin";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-gray-100">
        {/* HEADER */}
        <View className="bg-white px-4 py-3 flex-row items-center shadow-sm border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
            Detalles del Usuario
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerClassName="pb-10"
        >
          {/* TARJETA PERFIL */}
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
            <View
              className={`px-4 py-1 rounded-full ${
                isAdmin ? "bg-purple-100" : "bg-green-100"
              }`}
            >
              <Text
                className={`font-bold text-xs uppercase ${
                  isAdmin ? "text-purple-700" : "text-green-700"
                }`}
              >
                {user.role || "DRIVER"}
              </Text>
            </View>
          </View>

          {/* Datos Generales */}
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
            <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
              <Ionicons name="information-circle" size={22} color="#888" />
              <Text className="text-gray-700 font-bold ml-2">
                Datos Generales
              </Text>
            </View>

            <View className="gap-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">ID Sistema</Text>
                <Text className="text-gray-800 font-mono text-xs">
                  {user.id?.slice(0, 15)}...
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-500">Registrado el</Text>
                <Text className="text-gray-800 font-medium">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* SECCIÓN DRIVER (Si no es admin) */}
          {!isAdmin && (
            <View>
              {/* Tarjeta Info Conductor */}
              <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border-l-4 border-orange-500">
                <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
                  <View className="bg-orange-100 p-1.5 rounded-lg mr-2">
                    <Ionicons name="car" size={20} color="#ff6600" />
                  </View>
                  <Text className="text-gray-800 font-bold">
                    Información de Conductor
                  </Text>
                </View>
                <View className="flex-row justify-between mb-4">
                  <View>
                    <Text className="text-xs text-gray-500 uppercase">
                      Licencia
                    </Text>
                    <Text className="text-lg font-bold text-gray-800 mt-1">
                      {user.license_number || "---"}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-500 uppercase">
                      Estado
                    </Text>
                    <View
                      className={`mt-1 px-3 py-1 rounded-full ${
                        user.driver_status === "active"
                          ? "bg-green-100"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          user.driver_status === "active"
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        {(user.driver_status || "inactivo").toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* LISTA VEHÍCULOS ASIGNADOS */}
              <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                <View className="flex-row items-center justify-between mb-4 border-b border-gray-100 pb-2">
                  <View className="flex-row items-center">
                    <Ionicons name="bus" size={20} color="#555" />
                    <Text className="text-gray-800 font-bold ml-2">
                      Vehículos Asignados
                    </Text>
                  </View>

                  {/* Botón Asignar */}
                  {user.driver_status === "active" && (
                    <TouchableOpacity onPress={openAssignmentModal}>
                      <Text className="text-orange-500 font-bold text-sm">
                        + Asignar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {assignedVehicles.length === 0 ? (
                  <Text className="text-gray-400 italic text-center py-2">
                    No tiene vehículos asignados
                  </Text>
                ) : (
                  assignedVehicles.map((vehicle) => (
                    <View
                      key={vehicle.id}
                      className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200"
                    >
                      <View>
                        <Text className="font-bold text-gray-800">
                          {vehicle.model}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Placa: {vehicle.plate || "S/P"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleUnassign(vehicle.id)}
                        className="bg-red-50 p-2 rounded-full"
                      >
                        <Ionicons name="close" size={16} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              {/* BOTÓN: DESACTIVAR/REACTIVAR CONDUCTOR (CORREGIDO) */}
              {/* Eliminé el TouchableOpacity anidado que causaba error */}
              <TouchableOpacity
                onPress={handleSoftDelete}
                className={`p-4 rounded-xl flex-row items-center justify-center border mt-2 mb-6 ${
                  user.driver_status === "inactive"
                    ? "bg-white border-green-100"
                    : "bg-white border-red-100"
                }`}
              >
                <Ionicons
                  name={
                    user.driver_status === "inactive"
                      ? "refresh-outline"
                      : "ban-outline"
                  }
                  size={20}
                  color={
                    user.driver_status === "inactive" ? "#10b981" : "#ff3b30"
                  }
                />
                <Text
                  className={`font-bold ml-2 ${
                    user.driver_status === "inactive"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {user.driver_status === "inactive"
                    ? "Reactivar Conductor"
                    : "Desactivar Conductor"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* --- USO DEL MODAL REUTILIZABLE --- */}
      <AssignmentModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        data={availableVehicles}
        onSelect={handleSelectVehicle}
        title="Asignar Vehículo"
        emptyMessage="No hay vehículos disponibles en la flota."
        isLoading={isAssigning}
      />
    </SafeAreaView>
  );
}