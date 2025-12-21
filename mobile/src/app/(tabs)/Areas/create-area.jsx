import { useAuth } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
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

export default function CreateAreaScreen() {
  const { getToken } = useAuth()
  const router = useRouter()

  // Estados para los campos de la tabla Areas
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [isSaving, setIsSaving] = useState(false)

  async function saveArea() {
    // 1. Validación: Solo el nombre es estrictamente obligatorio
    if (!name.trim()) {
      Alert.alert("Campo incompleto", "Por favor ingresa un nombre para el área.")
      return
    }

    try {
      setIsSaving(true)
      const token = await getToken()

      if (!token) {
        throw new Error("No hay sesión activa. Por favor, inicia sesión nuevamente.")
      }

      //Usa tu URL de Ngrok (o la variable de entorno)
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://raptureless-iridescently-monte.ngrok-free.dev/api";

      const res = await fetch(`${API_URL}/areas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      })

      // Manejo de errores estándar
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        if (res.status === 401) throw new Error("Sesión expirada.")
        throw new Error(`Error del servidor (${res.status}).`)
      }

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "No se pudo guardar el área")
      }

      Alert.alert("Área registrada", "La zona se ha guardado correctamente 🎉", [
        {
          text: "OK",
          onPress: () => {
            setName("")
            setDescription("")
            router.replace("/Areas")
          }
        }
      ])

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
            <Text className="text-sm uppercase tracking-wide text-sky-400 font-bold">
              Nueva Zona
            </Text>
            <Text className="mt-2 text-3xl font-semibold text-white">
              Registrar Área
            </Text>
            <Text className="mt-3 text-white/70">
              Define una nueva ubicación física para tu operación (ej. Estacionamiento Norte).
            </Text>
          </View>

          <View className="mt-10 gap-6">

            {/* NOMBRE*/}
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Nombre del Área *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ej. Base Central"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white font-semibold"
              />
            </View>

            {/*DESCRIPCIÓN*/}
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Descripción
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Ej. Ubicada en la entrada principal, capacidad para 10 vehículos..."
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top" // Importante para que el texto empiece arriba en Android
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white min-h-[120px]"
              />
            </View>

          </View>

          <View className="mt-10 gap-4">
            <TouchableOpacity
              onPress={saveArea}
              disabled={isSaving}
              activeOpacity={0.85}
              className={`w-full rounded-2xl py-4 shadow-lg shadow-sky-500/30 ${isSaving ? "bg-sky-600/50" : "bg-sky-600"
                }`}
            >
              <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                {isSaving ? "Guardando..." : "Guardar Área"}
              </Text>
            </TouchableOpacity>

            <Link href="/Areas" replace asChild>
              <TouchableOpacity className="w-full rounded-2xl border border-white/15 py-4">
                <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}