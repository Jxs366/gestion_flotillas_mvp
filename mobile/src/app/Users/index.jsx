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

export default function UsersScreen() {
  const [users, setUsers] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  async function loadUsers() {
    try {
      setRefreshing(true)
      const token = await getToken()

      if (!token) {
        console.error("❌ No hay token de autenticación")
        setUsers([])
        return
      }
      
      // Asegúrate de que tu backend tenga la ruta GET /api/users creada
      const res = await fetch("https://raptureless-iridescently-monte.ngrok-free.dev/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json()
          console.error("❌ Error del servidor:", errorData)
        } else {
          console.error(`❌ Error HTTP ${res.status}: ${res.statusText}`)
        }
        setUsers([])
        return
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ El servidor no devolvió JSON. Content-Type:", contentType)
        setUsers([])
        return
      }

      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error.message)
      setUsers([])
    } finally {
      setRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
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
            onRefresh={loadUsers}
          />
        }
      >
        <View className="mb-8">
          <Text className="text-3xl font-semibold text-white">Usuarios</Text>
          <Text className="mt-2 text-base text-white/70">
            Administra los usuarios registrados en la plataforma.
          </Text>
        </View>

        {isLoading && users.length === 0 ? (
          <View className="flex-row items-center justify-center py-24">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : users.length === 0 ? (
          <View className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8">
            <Text className="text-xl font-semibold text-white">
              No hay usuarios
            </Text>
            <Text className="mt-2 text-white/70">
              Los usuarios aparecerán aquí automáticamente cuando se registren en la App.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {users.map((u) => (
              <View
                key={u.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
              >
                {/* Cabecera: Nombre y Rol */}
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                        <Text className="text-sm uppercase tracking-wide text-white/50">
                          Nombre
                        </Text>
                        <Text className="text-xl font-bold text-white tracking-wide">
                          {u.full_name || "Usuario sin nombre"}
                        </Text>
                    </View>
                    
                    {/* Badge de Rol */}
                    <View className={`px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-500/20' : 'bg-emerald-500/20'}`}>
                        <Text className={`font-bold text-xs uppercase ${u.role === 'admin' ? 'text-purple-300' : 'text-emerald-300'}`}>
                            {u.role || "DRIVER"}
                        </Text>
                    </View>
                </View>

                {/* Detalles: Email e ID */}
                <View className="mt-2 flex-row justify-between items-end">
                  <View className="flex-1">
                    <Text className="text-xs uppercase tracking-wide text-white/40">
                      Correo Electrónico
                    </Text>
                    <Text className="mt-1 text-base text-white/90">
                      {u.email}
                    </Text>
                  </View>
                  
                  {/* Opcional: Mostrar últimos caracteres del ID para referencia */}
                  <View className="items-end pl-2">
                    <Text className="text-xs uppercase tracking-wide text-white/40">
                      ID
                    </Text>
                    <Text className="mt-1 text-sm text-white/60">
                      ...{u.id?.slice?.(-4) || ""}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="mt-10 gap-4">
          {/* Eliminé el botón de "Registrar" porque eso se hace vía Webhook/Signup */}
          
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