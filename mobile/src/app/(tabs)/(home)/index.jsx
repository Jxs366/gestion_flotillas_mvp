
// app/dashboard/index.jsx
import { useUser } from "@clerk/clerk-expo";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardHeader from "../../components/DashboardHeader";
import { router } from "expo-router";

export default function DashboardScreen() {
    const { user } = useUser();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <DashboardHeader />

            {/* CONTENIDO */}
            <ScrollView className="flex-1 bg-gray-100">
                <View className="px-5 py-5">

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

                    <TouchableOpacity
                        className="bg-white flex-row items-center p-4 rounded-xl mb-3"
                        onPress={() => router.push("/Vehicles/create-vehicle")}
                    >
                        <Ionicons name="car" size={28} color="#ff6600" />
                        <Text className="text-base ml-3 text-gray-800">Crear Vehículo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-white flex-row items-center p-4 rounded-xl mb-3"
                        onPress={() => router.push("/Users/register")}
                    >
                        <Ionicons name="person-add" size={28} color="#ff6600" />
                        <Text className="text-base ml-3 text-gray-800">Crear Conductor</Text>
                    </TouchableOpacity>

                    {/* PRÓXIMOS MANTENIMIENTOS */}
                    <View className="bg-white p-5 rounded-xl mt-2 mb-10 border border-gray-200">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            Próximos Mantenimientos
                        </Text>

                        <View className="border-l-4 border-orange-500 pl-3 py-1 mb-3">
                            <Text className="text-gray-900 font-medium">Tsuru P01-ABC</Text>
                            <Text className="text-gray-600 text-sm">155,000 km</Text>
                        </View>

                        <View className="border-l-4 border-orange-500 pl-3 py-1">
                            <Text className="text-gray-900 font-medium">Frontier P02-DEF</Text>
                            <Text className="text-gray-600 text-sm">90,000 km</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
