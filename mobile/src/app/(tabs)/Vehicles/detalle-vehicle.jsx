import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const TEXT_DARK = "text-gray-800";
const TEXT_MUTED = "text-gray-500";
const BG_APP = "bg-gray-100";
const BG_CARD = "bg-white";
const BORDER_COLOR = "border-gray-200";

const COLOR_ORANGE = "#ff6600";
const COLOR_RED = "#ff3b30";
const COLOR_GREEN = "#10b981";
const TEXT_RED_500 = "text-red-500";
const BG_ORANGE_100 = "bg-orange-100";
const TEXT_GREEN_700 = "text-green-700";
const TEXT_ORANGE_700 = "text-orange-700";



const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "disponible":
      return { bgColor: "bg-green-100", textColor: TEXT_GREEN_700 };
    case "en uso":
      return { bgColor: BG_ORANGE_100, textColor: TEXT_ORANGE_700 };
    case "mantenimiento":
      return { bgColor: "bg-red-100", textColor: "text-red-700" };
    default:
      return { bgColor: "bg-gray-200", textColor: "text-gray-700" };
  }
};

const formatNumber = (num) => {
  if (!num) return "0";
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


export default function VehicleDetailStatic() {
  const vehicle = {
    name: "Nissan Versa 2020",
    plate: "XYA-1234",
    current_odometer: 150430,
    lastMaintenance: 145000,
    driver: "Juan Pérez",
    status: "Disponible",
    type: "Sedán",
    brand: "Nissan",
    year: 2020,
  };

  const statusStyles = getStatusStyles(vehicle.status);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className={`flex-1 ${BG_APP}`} contentContainerClassName="p-4 pb-10">

        {/* TARJETA PRINCIPAL*/}
        <View className={`${BG_CARD} p-5 rounded-xl shadow-sm border ${BORDER_COLOR} mb-6`}>

          {/* TÍTULO PRINCIPAL */}
          <Text className={`text-3xl font-extrabold ${TEXT_DARK} mb-2`}>
            {vehicle.name}
          </Text>

          {/* Placas y Año */}
          <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
            <View>
              <Text className={`text-sm uppercase ${TEXT_MUTED}`}>Placas</Text>
              <Text className={`text-xl font-bold ${TEXT_DARK}`}>{vehicle.plate}</Text>
            </View>
            <View className="items-end">
              <Text className={`text-sm uppercase ${TEXT_MUTED}`}>Año</Text>
              <Text className={`text-xl font-bold ${TEXT_DARK}`}>{vehicle.year}</Text>
            </View>
          </View>

          {/* BADGE DE ESTADO */}
          <View className={`${statusStyles.bgColor} mt-1 px-4 py-1 rounded-full self-start shadow-sm`}>
            <Text className={`font-bold text-xs uppercase ${statusStyles.textColor}`}>
              {vehicle.status}
            </Text>
          </View>

        </View>

        {/* INFORMACIÓN DETALLADA (KPIs)*/}
        <View className={`${BG_CARD} p-4 rounded-xl mb-6 shadow-sm border ${BORDER_COLOR}`}>
          <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
            <Ionicons name="information-circle-outline" size={22} color="#4b5563" />
            <Text className={`${TEXT_MUTED} font-bold ml-2`}>Detalles del Vehículo</Text>
          </View>

          <View className="gap-4">
            {/* Item: Conductor */}
            <View className="flex-row justify-between">
              <Text className={`text-base ${TEXT_MUTED}`}>Conductor Asignado</Text>
              <Text className={`text-base ${TEXT_DARK} font-semibold`}>{vehicle.driver}</Text>
            </View>

            {/* Item: Kilometraje Actual */}
            <View className="flex-row justify-between">
              <Text className={`text-base ${TEXT_MUTED}`}>Kilometraje Actual</Text>
              <Text className={`text-base ${TEXT_DARK} font-medium`}>
                {formatNumber(vehicle.current_odometer)} km
              </Text>
            </View>

            {/* Item: Último Mantenimiento */}
            <View className="flex-row justify-between">
              <Text className={`text-base ${TEXT_MUTED}`}>Último Mantenimiento</Text>
              <Text className={`text-base ${TEXT_DARK} font-medium`}>
                {formatNumber(vehicle.lastMaintenance)} km
              </Text>
            </View>

            {/* Item: Marca / Tipo */}
            <View className="flex-row justify-between">
              <Text className={`text-base ${TEXT_MUTED}`}>Marca / Tipo</Text>
              <Text className={`text-base ${TEXT_DARK} font-medium`}>{vehicle.brand} / {vehicle.type}</Text>
            </View>
          </View>
        </View>


        {/*BOTONES DE ACCIÓN PRINCIPAL */}
        <Text className={`text-xl font-bold mb-3 ${TEXT_DARK}`}>
          Gestión
        </Text>

        {/* ASIGNAR CONDUCTOR*/}
        <TouchableOpacity
          className={`p-4 rounded-xl flex-row items-center justify-center border mt-2 mb-3 bg-white border-gray-400`}
        >
          <Ionicons name="person-add-outline" size={20} color="#4b5563" />
          <Text className={`font-bold ml-2 text-gray-700`}>
            Asignar Conductor
          </Text>
        </TouchableOpacity>

        {/* REGISTRAR MANTENIMIENTO */}
        <TouchableOpacity
          className={`p-4 rounded-xl flex-row items-center justify-center border mb-6 bg-white border-orange-400`}
        >
          <MaterialIcons name="home-repair-service" size={20} color={COLOR_ORANGE} />
          <Text className={`font-bold ml-2 text-orange-600`}>
            Registrar Mantenimiento
          </Text>
        </TouchableOpacity>


        {/* ACCIONES SECUNDARIAS*/}
        <View className="flex-row justify-between pt-2">

          {/*EDITAR*/}
          <TouchableOpacity
            className={`${BG_CARD} flex-row items-center px-4 py-3 rounded-xl shadow-sm border border-orange-200 flex-1 mr-2 justify-center`}
          >
            <MaterialIcons name="edit" size={22} color={COLOR_ORANGE} />
            <Text className="ml-2 text-orange-600 font-semibold">Editar</Text>
          </TouchableOpacity>

          {/*ELIMINAR*/}
          <TouchableOpacity
            className={`${BG_CARD} flex-row items-center px-4 py-3 rounded-xl shadow-sm border border-red-200 flex-1 ml-2 justify-center`}
          >
            <MaterialIcons name="delete" size={22} color={COLOR_RED} />
            <Text className={`ml-2 ${TEXT_RED_500} font-semibold`}>Eliminar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}