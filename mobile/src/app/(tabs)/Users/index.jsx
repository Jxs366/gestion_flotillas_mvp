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
import { Ionicons } from "@expo/vector-icons"

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

      const res = await fetch(
        "https://sensately-nonlaminable-tempie.ngrok-free.dev/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

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
        console.error("❌ El servidor no devolvió JSON.")
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
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pb-32 pt-12"
        refreshControl={
          <RefreshControl
            tintColor="#000"
            refreshing={refreshing}
            onRefresh={loadUsers}
          />
        }
      >
        {/* ENCABEZADO */}
        <View className="mb-8">
          <Text className="text-3xl font-semibold text-gray-900">Usuarios</Text>
          <Text className="mt-2 text-base text-gray-500">
            Administra los usuarios registrados en la plataforma.
          </Text>
        </View>

        {/* CARGANDO */}
        {isLoading && users.length === 0 ? (
          <View className="flex-row items-center justify-center py-24">
            <ActivityIndicator size="large" color="#ff6600" />
          </View>
        ) : users.length === 0 ? (
          <View className="rounded-3xl border border-gray-300 bg-gray-50 p-8">
            <Text className="text-xl font-semibold text-gray-800">
              No hay usuarios
            </Text>
            <Text className="mt-2 text-gray-500">
              Los usuarios aparecerán aquí automáticamente cuando se registren en la App.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {users.map((u) => (
              <View
                key={u.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {/* Nombre & Rol */}
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="text-xs uppercase tracking-wide text-gray-500">
                      Nombre
                    </Text>
                    <Text className="text-xl font-bold text-gray-800">
                      {u.full_name || "Usuario sin nombre"}
                    </Text>
                  </View>

                  {/* BADGE DE ROL - AHORA DRIVER ES NARANJA */}
                  <View
                    className={`px-3 py-1 rounded-full ${
                      u.role === "admin"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    <Text
                      className={`font-bold text-xs uppercase ${
                        u.role === "admin"
                          ? "text-purple-700"
                          : "text-orange-700"
                      }`}
                    >
                      {u.role || "DRIVER"}
                    </Text>
                  </View>
                </View>

                {/* Email & ID */}
                <View className="mt-2 flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-xs uppercase text-gray-500">
                      Correo electrónico
                    </Text>
                    <Text className="mt-1 text-gray-700">
                      {u.email}
                    </Text>
                  </View>

                  <View className="items-end pl-2">
                    <Text className="text-xs uppercase text-gray-500">
                      ID
                    </Text>
                    <Text className="mt-1 text-sm text-gray-600">
                      ...{u.id?.slice?.(-4) || ""}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* BOTÓN FLOTANTE */}
      <Link href="/(tabs)/Users/register" asChild>
        <TouchableOpacity
          activeOpacity={0.85}
          className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/40"
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  )
}
