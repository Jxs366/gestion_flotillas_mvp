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

export default function AreasScreen() {
  const [areas, setAreas] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  async function loadAreas() {
    try {
      setRefreshing(true)
      const token = await getToken()

      if (!token) {
        setAreas([])
        return
      }
      
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://raptureless-iridescently-monte.ngrok-free.dev/api";

      const res = await fetch(`${API_URL}/areas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        setAreas([])
        return
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setAreas([])
        return
      }

      const data = await res.json()
      setAreas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando áreas:", error)
      setAreas([])
    } finally {
      setRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAreas()
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
            onRefresh={loadAreas}
          />
        }
      >
        <View className="mb-8">
          <Text className="text-3xl font-semibold text-white">Áreas</Text>
          <Text className="mt-2 text-base text-white/70">
            Gestiona las ubicaciones geográficas de tu flotilla.
          </Text>
        </View>

        {isLoading && areas.length === 0 ? (
          <View className="flex-row items-center justify-center py-24">
            <ActivityIndicator size="large" color="#0ea5e9" />
          </View>
        ) : areas.length === 0 ? (
          <View className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8">
            <Text className="text-xl font-semibold text-white">
              No hay áreas registradas
            </Text>
            <Text className="mt-2 text-white/70">
              Registra zonas de trabajo o estacionamientos para asignar vehículos.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {areas.map((area) => (
              <View
                key={area.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
              >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                        <Text className="text-xs uppercase tracking-wide text-sky-400 font-bold">
                          Zona / Área
                        </Text>
                        <Text className="text-2xl font-bold text-white tracking-wide mt-1">
                          {area.name || "Sin nombre"}
                        </Text>
                    </View>
                    
                    <View className="bg-sky-500/20 px-3 py-1 rounded-full">
                        <Text className="text-sky-300 text-xs font-bold">ACTIVO</Text>
                    </View>
                </View>

                <View className="mt-2">
                  <Text className="text-xs uppercase tracking-wide text-white/40">
                    Descripción
                  </Text>
                  <Text className="mt-1 text-base text-white/80 leading-relaxed">
                    {area.description || "Sin descripción disponible."}
                  </Text>
                </View>

                <View className="mt-4 pt-4 border-t border-white/5 flex-row justify-between items-center">
                    <Text className="text-xs text-white/30">
                        ID: ...{area.id ? area.id.slice(-6) : ""}
                    </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="mt-10 gap-4">
          <Link href="/Areas/create-area" push asChild>
            <TouchableOpacity className="w-full rounded-2xl bg-sky-600 py-4 shadow-lg shadow-sky-500/30">
              <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                Registrar nueva área
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