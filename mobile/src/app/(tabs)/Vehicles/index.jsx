import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
// Asegúrate de que este componente (DashboardHeader) ya no tiene la clase 'shadow-...'
import DashboardHeader from "../../components/DashboardHeader";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

const formatNumber = (num) => {
  if (!num) return "0";
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Función para asignar estilo según estado
const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case "disponible":
      return { bgColor: "bg-green-100", textColor: "text-green-800" };
    case "en uso":
      return { bgColor: "bg-blue-100", textColor: "text-blue-800" };
    case "mantenimiento":
      return { bgColor: "bg-red-100", textColor: "text-red-800" };
    default:
      return { bgColor: "bg-gray-200", textColor: "text-gray-700" };
  }
};

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  async function loadVehicles() {
    try {
      setRefreshing(true);
      const token = await getToken();

      if (!token) {
        console.error("❌ No hay token de autenticación");
        setVehicles([]);
        return;
      }

      // 1. CORRECCIÓN: Quitamos "https://" del inicio, confiamos en la variable de entorno
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/vehicles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // 2. CORRECCIÓN: Agregamos el header para Ngrok
            "ngrok-skip-browser-warning": "true",
            "User-Agent": "bypass-tunnel-reminder", // A veces ayuda también
          },
        }
      );

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error("❌ Error del servidor:", errorData);
        } else {
          console.error(`❌ Error HTTP ${res.status}: ${res.statusText}`);
        }
        setVehicles([]);
        return;
      }

      // Verificar que el Content-Type sea JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(
          "❌ El servidor no devolvió JSON. Content-Type:",
          contentType
        );
        setVehicles([]);
        return;
      }

      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar vehículos:", error.message);
      setVehicles([]);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
    console.log(vehicles);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 bg-gray-100">
        <DashboardHeader />

        {/* BUSCADOR */}
        <View className="p-4">
          {/* El buscador se ve simple y limpio */}
          <View className="bg-white flex-row items-center px-4 py-3 rounded-xl">
            <Ionicons name="search" size={22} color="#888" />
            <Text className="ml-2 text-gray-500">Buscar vehículo...</Text>
          </View>

          {/* FILTROS */}
          <View className="flex-row justify-between mt-3 ">
            {/* Los filtros se ven simples y limpios */}
            <TouchableOpacity className="bg-white px-4 py-2 rounded-xl">
              <Text className="text-gray-700">Estado ▼</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white px-4 py-2 rounded-xl">
              <Text className="text-gray-700">Tipo ▼</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white px-4 py-2 rounded-xl">
              <Text className="text-gray-700">Ordenar ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LISTA */}
        <ScrollView className="px-4">
          {vehicles.map((v) => {
            const statusStyles = getStatusStyles(v.status);

            return (
              <TouchableOpacity
                key={v.id}
                className="bg-white p-4 rounded-xl mb-4 flex-row justify-between"
                onPress={() =>
                  router.push(`/Vehicles/detalle-vehicle?id=${v.id}`)
                }
              >
                <View className="flex-row items-center">
                  <View className="bg-gray-100 rounded-xl p-3 mr-3">
                    <Ionicons name="car" size={30} color="#ff6600" />
                  </View>

                  <View>
                    <Text className="text-lg font-bold text-gray-800">
                      {v.model}
                    </Text>
                    <Text className="text-gray-600">Placas: {v.plate}</Text>
                    <Text className="text-gray-600">
                      KM: {formatNumber(v.current_odometer)}
                    </Text>
                    <Text className="text-gray-600">
                      Conductor: {v.driver || "N/A"}
                    </Text>

                    <View
                      className={`${statusStyles.bgColor} mt-1 px-3 py-1 rounded-full self-start`}
                    >
                      <Text
                        className={`text-xs font-bold ${statusStyles.textColor}`}
                      >
                        {v.status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="items-center">
                  <TouchableOpacity className="mb-16">
                    <Ionicons name="create" size={22} color="#007bff" />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Ionicons name="trash" size={22} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

          <View className="h-20" />
        </ScrollView>

        {/* BOTÓN FLOTANTE */}
        {/* Este botón aún tiene sombra ('shadow-lg') para que parezca flotar */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-orange-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push("/Vehicles/create-vehicle")}
        >
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
