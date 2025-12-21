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

const PRIMARY_COLOR = "text-orange-600";
const TEXT_DARK = "text-gray-800";
const TEXT_MUTED = "text-gray-500";
const BG_CARD = "bg-white";
const BG_APP = "bg-gray-100";
const BORDER_COLOR = "border-gray-200";

export default function DashboardScreen() {
    const { user } = useUser();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* HEADER*/}
            <DashboardHeader />

            {/* CONTENIDO*/}
            <ScrollView className={`flex-1 ${BG_APP}`}>
                <View className="px-4 py-4">

                    {/*KPIs*/}
                    <View className="flex-row flex-wrap justify-between">

                        {/* KPI: Disponibles */}
                        <View className={`${BG_CARD} w-[48%] p-5 rounded-xl mb-4 items-center shadow-sm border ${BORDER_COLOR}`}>
                            <Text className={`text-4xl font-extrabold ${PRIMARY_COLOR}`}>15</Text>
                            <Text className={`text-sm ${TEXT_MUTED} mt-1`}>Disponibles</Text>
                        </View>

                        {/* KPI: En Uso*/}
                        <View className={`${BG_CARD} w-[48%] p-5 rounded-xl mb-4 items-center shadow-sm border ${BORDER_COLOR}`}>
                            <Text className={`text-4xl font-extrabold ${PRIMARY_COLOR}`}>7</Text>
                            <Text className={`text-sm ${TEXT_MUTED} mt-1`}>En Uso</Text>
                        </View>

                        {/* KPI: Mantenimiento*/}
                        <View className={`${BG_CARD} w-[48%] p-5 rounded-xl mb-4 items-center shadow-sm border ${BORDER_COLOR}`}>
                            <Text className={`text-4xl font-extrabold ${PRIMARY_COLOR}`}>3</Text>
                            <Text className={`text-sm ${TEXT_MUTED} mt-1`}>Mantenimiento</Text>
                        </View>

                        {/* KPI: Asignaciones*/}
                        <View className={`${BG_CARD} w-[48%] p-5 rounded-xl mb-4 items-center shadow-sm border ${BORDER_COLOR}`}>
                            <Text className={`text-4xl font-extrabold ${PRIMARY_COLOR}`}>7</Text>
                            <Text className={`text-sm ${TEXT_MUTED} mt-1`}>Asignaciones Activas</Text>
                        </View>
                    </View>

                    {/* --- ACCIONES RÁPIDAS --- */}
                    <Text className={`text-xl font-bold mt-4 mb-3 ${TEXT_DARK}`}>
                        Acciones Rápidas
                    </Text>


                    <TouchableOpacity className={`${BG_CARD} flex-row items-center p-4 rounded-xl mb-3 shadow-sm border ${BORDER_COLOR}`}>
                        <View className={`p-2 rounded-lg bg-orange-100 mr-3`}>
                            <Ionicons name="document-text-outline" size={24} color="#f97316" />
                        </View>
                        <Text className={`text-base font-medium ${TEXT_DARK}`}>Nueva Asignación</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className={`${BG_CARD} flex-row items-center p-4 rounded-xl mb-3 shadow-sm border ${BORDER_COLOR}`}>
                        <View className={`p-2 rounded-lg bg-orange-100 mr-3`}>
                            <Ionicons name="build-outline" size={24} color="#f97316" />
                        </View>
                        <Text className={`text-base font-medium ${TEXT_DARK}`}>
                            Registrar Mantenimiento
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`${BG_CARD} flex-row items-center p-4 rounded-xl mb-3 shadow-sm border ${BORDER_COLOR}`}
                        onPress={() => router.push("/Vehicles/create-vehicle")}
                    >
                        <View className={`p-2 rounded-lg bg-orange-100 mr-3`}>
                            <Ionicons name="car-outline" size={24} color="#f97316" />
                        </View>
                        <Text className={`text-base font-medium ${TEXT_DARK}`}>Crear Vehículo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`${BG_CARD} flex-row items-center p-4 rounded-xl mb-3 shadow-sm border ${BORDER_COLOR}`}
                        onPress={() => router.push("/Users/register")}
                    >
                        <View className={`p-2 rounded-lg bg-orange-100 mr-3`}>
                            <Ionicons name="person-add-outline" size={24} color="#f97316" />
                        </View>
                        <Text className={`text-base font-medium ${TEXT_DARK}`}>Crear Conductor</Text>
                    </TouchableOpacity>

                    {/* --- PRÓXIMOS MANTENIMIENTOS --- */}
                    <View className={`${BG_CARD} p-5 rounded-xl mt-4 mb-10 shadow-sm border ${BORDER_COLOR}`}>

                        <Text className={`text-xl font-bold ${TEXT_DARK} mb-3`}>
                            Próximos Mantenimientos
                        </Text>

                        <View className={`flex-row justify-between items-center py-2 border-b ${BORDER_COLOR}`}>
                            <View className="flex-row items-center">
                                {/* Usamos Naranja para el warning */}
                                <Ionicons name="warning-outline" size={20} color="#f97316" />
                                <Text className={`font-medium ml-2 ${TEXT_DARK}`}>Tsuru P01-ABC</Text>
                            </View>
                            <Text className={`text-sm font-semibold ${PRIMARY_COLOR}`}>155,000 km</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <View className="flex-row items-center">
                                <Ionicons name="warning-outline" size={20} color="#f97316" />
                                <Text className={`font-medium ml-2 ${TEXT_DARK}`}>Frontier P02-DEF</Text>
                            </View>
                            <Text className={`text-sm font-semibold ${PRIMARY_COLOR}`}>90,000 km</Text>
                        </View>

                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}