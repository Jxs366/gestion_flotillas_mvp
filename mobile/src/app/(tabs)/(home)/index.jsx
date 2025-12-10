import { useUser } from "@clerk/clerk-expo";
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from "react-native"; 
import { Ionicons } from "@expo/vector-icons";
import DashboardHeader from "../../components/DashboardHeader";


export default function DashboardScreen({ navigation }) {
  const { user } = useUser();

  return (
    // SafeAreaView con 'bg-white'
    <SafeAreaView className="flex-1 bg-white">
        
      {/* Aseguramos el color del contenido de la Barra de Estado (negro) */}
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <DashboardHeader navigation={navigation} /> 

      {/* CONTENIDO */}
      <ScrollView className="flex-1 bg-gray-100">

        <View className="px-5 py-5">
            {/* ALERTAS */}
            <View className="bg-yellow-100 p-4 rounded-xl mb-5">
                <Text className="font-bold text-lg mb-1">🚨 Alertas Importantes</Text>
                <Text className="text-gray-700">• 2 vehículos requieren mantenimiento</Text>
                <Text className="text-gray-700">• 1 asignación atrasada</Text>
                <Text className="text-gray-700">• 3 conductores con pendientes</Text>
            </View>

            {/* KPIs */}
            <View className="flex-row flex-wrap justify-between">
                <View className="bg-white w-[48%] p-5 rounded-xl mb-4 items-center">
                    <Text className="text-3xl font-bold text-orange-600">15</Text>
                    <Text className="text-gray-800">Disponibles</Text>
                </View>

                <View className="bg-white w-[48%] p-5 rounded-xl mb-4 items-center">
                    <Text className="text-3xl font-bold text-orange-600">7</Text>
                    <Text className="text-gray-800">En Uso</Text>
                </View>

                <View className="bg-white w-[48%] p-5 rounded-xl mb-4 items-center">
                    <Text className="text-3xl font-bold text-orange-600">3</Text>
                    <Text className="text-gray-800">Mantenimiento</Text>
                </View>

                <View className="bg-white w-[48%] p-5 rounded-xl mb-4 items-center">
                    <Text className="text-3xl font-bold text-orange-600">7</Text>
                    <Text className="text-gray-800">Asignaciones</Text>
                </View>
            </View>

            {/* ACCIONES RÁPIDAS */}
            <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">
                Acciones Rápidas
            </Text>

            <TouchableOpacity className="bg-white flex-row items-center p-4 rounded-xl mb-3">
                <Ionicons name="document-text" size={28} color="#ff6600" />
                <Text className="text-base ml-3 text-gray-800">Nueva Asignación</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white flex-row items-center p-4 rounded-xl mb-3">
                <Ionicons name="build" size={28} color="#ff6600" />
                <Text className="text-base ml-3 text-gray-800">
                    Registrar Mantenimiento
                </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white flex-row items-center p-4 rounded-xl mb-3">
                <Ionicons name="car" size={28} color="#ff6600" />
                <Text className="text-base ml-3 text-gray-800">Crear Vehículo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white flex-row items-center p-4 rounded-xl mb-3">
                <Ionicons name="person-add" size={28} color="#ff6600" />
                <Text className="text-base ml-3 text-gray-800">Crear Conductor</Text>
            </TouchableOpacity>

            {/* PRÓXIMOS MANTENIMIENTOS */}
            <View className="bg-white p-4 rounded-xl mt-2 mb-10">
                <Text className="text-xl font-bold mb-2 text-gray-800">
                    Próximos Mantenimientos
                </Text>
                <Text className="text-gray-700">• Tsuru P01-ABC → 155,000 km</Text>
                <Text className="text-gray-700">• Frontier P02-DEF → 90,000 km</Text>
            </View>
        
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
