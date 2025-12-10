// import { useAuth } from "@clerk/clerk-expo"
// import { Link } from "expo-router"
// import { useEffect, useState } from "react"
// import {
//   ActivityIndicator,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"

// export default function VehiclesScreen() {
//   const [vehicles, setVehicles] = useState([])
//   const [refreshing, setRefreshing] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const { getToken } = useAuth()

//   async function loadVehicles() {
//     try {
//       setRefreshing(true)
//       const token = await getToken()

//       if (!token) {
//         console.error("❌ No hay token de autenticación")
//         setVehicles([])
//         return
//       }
      
//       const res = await fetch("https://raptureless-iridescently-monte.ngrok-free.dev/api/vehicles", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       // Verificar el status de la respuesta
//       if (!res.ok) {
//         const contentType = res.headers.get("content-type")
//         if (contentType && contentType.includes("application/json")) {
//           const errorData = await res.json()
//           console.error("❌ Error del servidor:", errorData)
//         } else {
//           console.error(`❌ Error HTTP ${res.status}: ${res.statusText}`)
//         }
//         setVehicles([])
//         return
//       }

//       // Verificar que el Content-Type sea JSON
//       const contentType = res.headers.get("content-type")
//       if (!contentType || !contentType.includes("application/json")) {
//         console.error("❌ El servidor no devolvió JSON. Content-Type:", contentType)
//         setVehicles([])
//         return
//       }

//       const data = await res.json()
//       setVehicles(Array.isArray(data) ? data : [])
//     } catch (error) {
//       console.error("❌ Error al cargar vehículos:", error.message)
//       setVehicles([])
//     } finally {
//       setRefreshing(false)
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadVehicles()
//   }, [])

//   return (
//     <SafeAreaView className="flex-1 bg-slate-950">
//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         contentContainerClassName="px-6 pb-20 pt-12"
//         refreshControl={
//           <RefreshControl
//             tintColor="#fff"
//             refreshing={refreshing}
//             onRefresh={loadVehicles}
//           />
//         }
//       >
//         <View className="mb-8">
//           <Text className="text-3xl font-semibold text-white">Vehículos</Text>
//           <Text className="mt-2 text-base text-white/70">
//             Consulta la información más reciente de tus vehículos.
//           </Text>
//         </View>

//         {isLoading && vehicles.length === 0 ? (
//           <View className="flex-row items-center justify-center py-24">
//             <ActivityIndicator size="large" color="#10b981" />
//           </View>
//         ) : vehicles.length === 0 ? (
//           <View className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8">
//             <Text className="text-xl font-semibold text-white">
//               Aún no tienes vehículos
//             </Text>
//             <Text className="mt-2 text-white/70">
//               Registra tu primer vehículo para visualizarlo en esta lista.
//             </Text>
//           </View>
//         ) : (
//           <View className="gap-4">
//             {vehicles.map((v) => (
//               <View
//                 key={v.id}
//                 className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
//               >
//                 <Text className="text-sm uppercase tracking-wide text-white/50">
//                   Placa
//                 </Text>
//                 <Text className="text-2xl font-semibold text-white">
//                   {v.plate || "N/D"}
//                 </Text>
//                 <View className="mt-4 flex-row justify-between">
//                   <View>
//                     <Text className="text-xs uppercase tracking-wide text-white/40">
//                       Modelo
//                     </Text>
//                     <Text className="mt-1 text-lg text-white">
//                       {v.model || "Sin especificar"}
//                     </Text>
//                   </View>
//                   <View className="items-end">
//                     <Text className="text-xs uppercase tracking-wide text-white/40">
//                       ID
//                     </Text>
//                     <Text className="mt-1 text-lg text-white/80">
//                       {v.id?.slice?.(0, 6) || "—"}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         <View className="mt-10 gap-4">
//           <Link href="/Vehicles/create-vehicle" push asChild>
//             <TouchableOpacity className="w-full rounded-2xl bg-emerald-500 py-4 shadow-lg shadow-emerald-500/30">
//               <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
//                 Registrar nuevo vehículo
//               </Text>
//             </TouchableOpacity>
//           </Link>
//           <Link href="/(home)/" replace asChild>
//             <TouchableOpacity className="w-full rounded-2xl border border-white/15 bg-transparent py-4">
//               <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
//                 Volver a inicio
//               </Text>
//             </TouchableOpacity>
//           </Link>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DashboardHeader from "../../components/DashboardHeader";

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
  const vehicles = [
    {
      id: 1,
      name: "Nissan Versa 2020",
      plates: "XYA-1234",
      status: "Disponible",
      km: 150430,
      lastKm: 145000,
      driver: "Juan Pérez",
    },
    {
      id: 2,
      name: "Toyota Hilux 2023",
      plates: "PQR-5678",
      status: "En uso",
      km: 32400,
      lastKm: 30000,
      driver: "Carlos Soto",
    },
    {
      id: 3,
      name: "Ford Transit 2019",
      plates: "HJK-9012",
      status: "Mantenimiento",
      km: 85000,
      lastKm: 80000,
      driver: null,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 bg-gray-100">
        <DashboardHeader />

        {/* BUSCADOR */}
        <View className="p-4">
          <View className="bg-white flex-row items-center px-4 py-3 rounded-xl">
            <Ionicons name="search" size={22} color="#888" />
            <Text className="ml-2 text-gray-500">Buscar vehículo...</Text>
          </View>

          {/* FILTROS */}
          <View className="flex-row justify-between mt-3">
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

          {/* KPIs */}
          <View className="flex-row justify-between mt-4">
            <Text className="text-gray-700 font-bold">TOTAL: 22</Text>
            <Text className="text-green-600 font-bold">DISP: 15</Text>
            <Text className="text-blue-600 font-bold">USO: 5</Text>
            <Text className="text-orange-500 font-bold">MANT: 2</Text>
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
                onPress={() => router.push(`/Vehicles/detalle-vehicle?id=${v.id}`)}
              >
                <View className="flex-row items-center">
                  <View className="bg-gray-100 rounded-xl p-3 mr-3">
                    <Ionicons name="car" size={30} color="#ff6600" />
                  </View>

                  <View>
                    <Text className="text-lg font-bold text-gray-800">{v.name}</Text>
                    <Text className="text-gray-600">Placas: {v.plates}</Text>
                    <Text className="text-gray-600">KM: {v.km.toLocaleString()}</Text>
                    <Text className="text-gray-600">Últ. mant: {v.lastKm.toLocaleString()} km</Text>
                    <Text className="text-gray-600">Conductor: {v.driver || "N/A"}</Text>

                    {/* Badge de estado */}
                    <View className={`${statusStyles.bgColor} mt-1 px-3 py-1 rounded-full self-start`}>
                      <Text className={`text-xs font-bold ${statusStyles.textColor}`}>
                        {v.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ICONOS */}
                <View className="items-center">
                  <TouchableOpacity className="mb-16">
                    <Ionicons name="create" size={28} color="#007bff" />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Ionicons name="trash" size={28} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

          <View className="h-20" />
        </ScrollView>

        {/* BOTÓN FLOTANTE */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-orange-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push("/Vehicles/crear-vehicle")}
        >
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
