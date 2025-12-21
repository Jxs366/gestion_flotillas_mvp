import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
<<<<<<< HEAD
  // Eliminados: RefreshControl, ActivityIndicator (para evitar el error)
=======
>>>>>>> guillermo
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DashboardHeader from "../../components/DashboardHeader";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> guillermo

const formatNumber = (num) => {
  if (!num) return "0";
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "disponible":
      return { bgColor: "bg-emerald-100", textColor: "text-emerald-700" };
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
<<<<<<< HEAD
      // Simplificado: Sin chequeo de 'refreshing' aquí
      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        console.error("No hay token de autenticación");
=======
      setRefreshing(true);
      const token = await getToken();

      if (!token) {
        console.error("❌ No hay token de autenticación");
>>>>>>> guillermo
        setVehicles([]);
        return;
      }

<<<<<<< HEAD
      const res = await fetch(
        "https://sensately-nonlaminable-tempie.ngrok-free.dev/api/vehicles",
=======
      // 1. CORRECCIÓN: Quitamos "https://" del inicio, confiamos en la variable de entorno
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/vehicles`,
>>>>>>> guillermo
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
<<<<<<< HEAD
          },
        }
      );

      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error al cargar vehículos:", error.message);
=======
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
>>>>>>> guillermo
      setVehicles([]);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
<<<<<<< HEAD
=======
    console.log(vehicles);
>>>>>>> guillermo
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <DashboardHeader />

      <View className="flex-1 bg-gray-100">

        <ScrollView
          className="flex-1 px-4"
          contentContainerClassName="pb-20"
        >

          {/* BLOQUE DE BUSCADOR Y FILTROS */}
          <View className="mt-4 mb-4 gap-3">

            {/* BUSCADOR */}
            <View className="bg-white flex-row items-center px-4 py-3 rounded-xl shadow-sm border border-gray-300">
              <Ionicons name="search" size={22} color="#888" />
              <Text className="ml-2 text-gray-500">Buscar vehículo...</Text>
            </View>

            {/* FILTROS */}
            <View className="flex-row justify-between">
              <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
                <Text className="text-gray-700 font-medium">Estado ▼</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
                <Text className="text-gray-700 font-medium">Tipo ▼</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
                <Text className="text-gray-700 font-medium">Ordenar ▼</Text>
              </TouchableOpacity>
            </View>
          </View>


          {/* LISTA DE VEHÍCULOS */}
          {vehicles.map((v) => {
            const statusStyles = getStatusStyles(v.status);

            return (
              <TouchableOpacity
                key={v.id}
<<<<<<< HEAD
                className="bg-white p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm border border-gray-200"
                onPress={() => router.push(`/Vehicles/detalle-vehicle?id=${v.id}`)}
=======
                className="bg-white p-4 rounded-xl mb-4 flex-row justify-between"
                onPress={() =>
                  router.push(`/Vehicles/detalle-vehicle?id=${v.id}`)
                }
>>>>>>> guillermo
              >
                <View className="flex-row items-center flex-1 pr-2">
                  <View className="bg-gray-100 rounded-xl p-3 mr-3">
                    <Ionicons name="car" size={30} color="#ff6600" />
                  </View>

<<<<<<< HEAD
                  {/* Bloque de Detalles */}
                  <View className="flex-shrink">
                    <Text className="text-lg font-bold text-gray-800">
                      {v.make} {v.model}
                    </Text>

                    <Text className="text-gray-600 text-sm">Placas: {v.plate}</Text>

                    <Text className="text-gray-600 text-sm">
                      KM: {formatNumber(v.current_odometer)}
                    </Text>

                    <Text className="text-gray-600 text-sm">
                      Conductor: {v.driver || "N/A"}
                    </Text>
=======
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
>>>>>>> guillermo
                  </View>
                </View>

                {/* Badge de Estado*/}
                <View className={`px-3 py-1 rounded-full self-start ${statusStyles.bgColor}`}>
                  <Text className={`text-xs font-bold uppercase ${statusStyles.textColor}`}>
                    {v.status?.toUpperCase()}
                  </Text>
                </View>

              </TouchableOpacity>
            );
          })}

          <View className="h-20" />
        </ScrollView>

        {/* BOTÓN FLOTANTE */}
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
