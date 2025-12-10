import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();

  // 🔹 Simulación de datos (luego lo reemplazas por tu API o estado global)
  const vehicle = {
    id,
    name: "Nissan Versa 2020",
    plates: "XYA-1234",
    km: 150430,
    lastMaintenance: 145000,
    driver: "Juan Pérez",
    status: "Disponible",
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">

      {/* ENCABEZADO */}
      <View className="flex-row items-center mb-5">
        <Ionicons name="car-sport" size={38} color="#ff6600" />
        <Text className="text-3xl font-extrabold ml-3 text-gray-900">
          {vehicle.name}
        </Text>
      </View>

      {/* CARD PRINCIPAL */}
      <View className="bg-white p-5 rounded-2xl shadow-md mb-5">
        <Text className="text-gray-700 text-lg mb-1">
          Placas: <Text className="font-semibold">{vehicle.plates}</Text>
        </Text>

        <Text className="text-gray-700 text-lg mb-1">
          Kilometraje:{" "}
          <Text className="font-semibold">
            {vehicle.km.toLocaleString()} km
          </Text>
        </Text>

        <Text className="text-gray-700 text-lg mb-1">
          Último mantenimiento:{" "}
          <Text className="font-semibold">
            {vehicle.lastMaintenance.toLocaleString()} km
          </Text>
        </Text>

        <Text className="text-gray-700 text-lg mt-2">
          Conductor actual:{" "}
          <Text className="font-semibold">{vehicle.driver}</Text>
        </Text>

        {/* ESTADO */}
        <View className="mt-4 self-start px-4 py-1.5 rounded-full bg-green-100">
          <Text className="text-green-700 font-bold text-sm">
            {vehicle.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* BOTÓN ASIGNAR CONDUCTOR */}
      <TouchableOpacity
        onPress={() => router.push(`/Vehicles/asignar-driver?id=${vehicle.id}`)}
        className="flex-row items-center bg-blue-600 p-4 rounded-xl mb-5 shadow-md"
      >
        <Ionicons name="person-add" size={24} color="#ffffff" />
        <Text className="text-white ml-3 font-semibold text-lg">
          Asignar Conductor
        </Text>
      </TouchableOpacity>

      {/* BOTÓN REGISTRAR MANTENIMIENTO */}
      <TouchableOpacity
        onPress={() => router.push(`/Vehicles/registrar-mantenimiento?id=${vehicle.id}`)}
        className="flex-row items-center bg-orange-500 p-4 rounded-xl mb-5 shadow-md"
      >
        <MaterialIcons name="home-repair-service" size={24} color="#ffffff" />
        <Text className="text-white ml-3 font-semibold text-lg">
          Registrar Mantenimiento
        </Text>
      </TouchableOpacity>

      {/* ACCIONES */}
      <View className="flex-row justify-between mt-2">

        {/* EDITAR */}
        <TouchableOpacity
          className="flex-row items-center bg-orange-100 px-5 py-4 rounded-xl shadow-sm"
          onPress={() => router.push(`/Vehicles/editar-vehicle?id=${vehicle.id}`)}
        >
          <MaterialIcons name="edit" size={22} color="#ff6600" />
          <Text className="ml-2 text-orange-600 font-semibold">Editar</Text>
        </TouchableOpacity>

        {/* ELIMINAR */}
        <TouchableOpacity
          className="flex-row items-center bg-red-100 px-5 py-4 rounded-xl shadow-sm"
          onPress={() => console.log("Eliminar vehículo")}
        >
          <MaterialIcons name="delete" size={22} color="#e63946" />
          <Text className="ml-2 text-red-600 font-semibold">Eliminar</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}
