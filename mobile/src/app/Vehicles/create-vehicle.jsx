import { useAuth } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function CreateVehicleScreen() {
  const { getToken } = useAuth()
  const [plate, setPlate] = useState("")
  const [model, setModel] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  async function saveVehicle() {
    if (!plate || !model) {
      Alert.alert("Campos incompletos", "Ingresa el modelo y la placa.")
      return
    }

    try {
      setIsSaving(true)
      const token = await getToken()

      if (!token) {
        throw new Error("No hay sesión activa. Por favor, inicia sesión nuevamente.")
      }

      const res = await fetch("http://192.168.0.14:4000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plate,
          model,
        }),
      })

      // Verificar el Content-Type antes de parsear
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        if (res.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        }
        throw new Error(`Error del servidor (${res.status}). Intenta nuevamente.`)
      }

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "No se pudo guardar el vehículo")
      }

      const data = await res.json()
      setPlate("")
      setModel("")
      Alert.alert("Vehículo registrado", "Se guardó correctamente 🎉")
    } catch (error) {
      Alert.alert("Error", error.message ?? "Intenta nuevamente")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pb-20 pt-12"
        >
          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-sm uppercase tracking-wide text-white/60">
              Nuevo registro
            </Text>
            <Text className="mt-2 text-3xl font-semibold text-white">
              Agrega un vehículo
            </Text>
            <Text className="mt-3 text-white/70">
              Completa los campos para incorporarlo a tu control vehicular.
            </Text>
          </View>

          <View className="mt-10 gap-6">
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Modelo
              </Text>
              <TextInput
                value={model}
                onChangeText={setModel}
                placeholder="Ej. Toyota Hilux 2023"
                placeholderTextColor="#94a3b8"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
              />
            </View>
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Placa
              </Text>
              <TextInput
                value={plate}
                onChangeText={(value) => setPlate(value.toUpperCase())}
                autoCapitalize="characters"
                placeholder="ABC123"
                placeholderTextColor="#94a3b8"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white tracking-[0.3em]"
              />
            </View>
          </View>

          <View className="mt-10 gap-4">
            <TouchableOpacity
              onPress={saveVehicle}
              disabled={isSaving}
              activeOpacity={0.85}
              className={`w-full rounded-2xl py-4 shadow-lg shadow-emerald-500/30 ${
                isSaving ? "bg-emerald-500/50" : "bg-emerald-500"
              }`}
            >
              <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                {isSaving ? "Guardando..." : "Guardar vehículo"}
              </Text>
            </TouchableOpacity>

            <Link href="/Vehicles" replace asChild>
              <TouchableOpacity className="w-full rounded-2xl border border-white/15 py-4">
                <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                  Ver listado
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}