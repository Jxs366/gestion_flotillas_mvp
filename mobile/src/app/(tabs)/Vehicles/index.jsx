import { useAuth } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  async function loadVehicles() {
    try {
      setRefreshing(true)
      const token = await getToken()

      if (!token) {
        console.error("❌ No hay token de autenticación")
        setVehicles([])
        return
      }
      
      const res = await fetch("https://raptureless-iridescently-monte.ngrok-free.dev/api/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Verificar el status de la respuesta
      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json()
          console.error("❌ Error del servidor:", errorData)
        } else {
          console.error(`❌ Error HTTP ${res.status}: ${res.statusText}`)
        }
        setVehicles([])
        return
      }

      // Verificar que el Content-Type sea JSON
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ El servidor no devolvió JSON. Content-Type:", contentType)
        setVehicles([])
        return
      }

      const data = await res.json()
      setVehicles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("❌ Error al cargar vehículos:", error.message)
      setVehicles([])
    } finally {
      setRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pb-20 pt-12"
        refreshControl={
          <RefreshControl
            tintColor="#fff"
            refreshing={refreshing}
            onRefresh={loadVehicles}
          />
        }
      >
        <View className="mb-8">
          <Text className="text-3xl font-semibold text-white">Vehículos</Text>
          <Text className="mt-2 text-base text-white/70">
            Consulta la información más reciente de tus vehículos.
          </Text>
        </View>

        {isLoading && vehicles.length === 0 ? (
          <View className="flex-row items-center justify-center py-24">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : vehicles.length === 0 ? (
          <View className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8">
            <Text className="text-xl font-semibold text-white">
              Aún no tienes vehículos
            </Text>
            <Text className="mt-2 text-white/70">
              Registra tu primer vehículo para visualizarlo en esta lista.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {vehicles.map((v) => (
              <View
                key={v.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
              >
                <Text className="text-sm uppercase tracking-wide text-white/50">
                  Placa
                </Text>
                <Text className="text-2xl font-semibold text-white">
                  {v.plate || "N/D"}
                </Text>
                <View className="mt-4 flex-row justify-between">
                  <View>
                    <Text className="text-xs uppercase tracking-wide text-white/40">
                      Modelo
                    </Text>
                    <Text className="mt-1 text-lg text-white">
                      {v.model || "Sin especificar"}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs uppercase tracking-wide text-white/40">
                      ID
                    </Text>
                    <Text className="mt-1 text-lg text-white/80">
                      {v.id?.slice?.(0, 6) || "—"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="mt-10 gap-4">
          <Link href="/Vehicles/create-vehicle" push asChild>
            <TouchableOpacity className="w-full rounded-2xl bg-emerald-500 py-4 shadow-lg shadow-emerald-500/30">
              <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                Registrar nuevo vehículo
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(home)/" replace asChild>
            <TouchableOpacity className="w-full rounded-2xl border border-white/15 bg-transparent py-4">
              <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                Volver a inicio
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
