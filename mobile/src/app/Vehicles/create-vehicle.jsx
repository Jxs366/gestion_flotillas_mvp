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
  
  // 1. ESTADOS PARA TODOS LOS CAMPOS
  const [vin, setVin] = useState("")
  const [make, setMake] = useState("") // Marca
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [plate, setPlate] = useState("")
  const [odometer, setOdometer] = useState("")

  const [isSaving, setIsSaving] = useState(false)

  async function saveVehicle() {
    // 2. VALIDACIÓN DE CAMPOS OBLIGATORIOS
    // Según tu DB: vin, plate, make, model son NOT NULL.
    if (!vin || !make || !model || !plate) {
      Alert.alert("Campos incompletos", "Por favor ingresa al menos VIN, Marca, Modelo y Placa.")
      return
    }

    try {
      setIsSaving(true)
      const token = await getToken()

      if (!token) {
        throw new Error("No hay sesión activa. Por favor, inicia sesión nuevamente.")
      }

      // NOTA: Asegúrate de que esta URL sea la correcta de tu Ngrok actual
      const res = await fetch("https://raptureless-iridescently-monte.ngrok-free.dev/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // 3. ENVIAR TODOS LOS DATOS
        body: JSON.stringify({
          vin,
          plate,
          make,
          model,
          year,
          current_odometer: parseInt(odometer) || 0, // Convertir a número, default 0
        }),
      })

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        if (res.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        }
        throw new Error(`Error del servidor (${res.status}). Intenta nuevamente.`)
      }

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || errorData.error || "No se pudo guardar el vehículo")
      }

      const data = await res.json()
      
      // Limpiar formulario
      setVin("")
      setMake("")
      setModel("")
      setYear("")
      setPlate("")
      setOdometer("")
      
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
              Ingresa los datos técnicos de la unidad.
            </Text>
          </View>

          <View className="mt-10 gap-6">
            
            {/* --- VIN (Obligatorio) --- */}
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                VIN (Número de Serie) *
              </Text>
              <TextInput
                value={vin}
                onChangeText={(text) => setVin(text.toUpperCase())}
                placeholder="Ej. 1HGCM826..."
                placeholderTextColor="#94a3b8"
                autoCapitalize="characters"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
              />
            </View>

            {/* --- MARCA y MODELO (Fila) --- */}
            <View className="flex-row gap-4">
                <View className="flex-1">
                <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                    Marca *
                </Text>
                <TextInput
                    value={make}
                    onChangeText={setMake}
                    placeholder="Toyota"
                    placeholderTextColor="#94a3b8"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                />
                </View>
                <View className="flex-1">
                <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                    Modelo *
                </Text>
                <TextInput
                    value={model}
                    onChangeText={setModel}
                    placeholder="Hilux"
                    placeholderTextColor="#94a3b8"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                />
                </View>
            </View>

            {/* --- AÑO y PLACA (Fila) --- */}
            <View className="flex-row gap-4">
                <View className="flex-1">
                <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                    Año
                </Text>
                <TextInput
                    value={year}
                    onChangeText={setYear}
                    placeholder="2023"
                    keyboardType="numeric"
                    placeholderTextColor="#94a3b8"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                />
                </View>
                <View className="flex-1">
                <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                    Placa *
                </Text>
                <TextInput
                    value={plate}
                    onChangeText={(value) => setPlate(value.toUpperCase())}
                    autoCapitalize="characters"
                    placeholder="ABC1234"
                    placeholderTextColor="#94a3b8"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white tracking-widest"
                />
                </View>
            </View>

             {/* --- ODOMETRO --- */}
             <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Kilometraje Inicial
              </Text>
              <TextInput
                value={odometer}
                onChangeText={setOdometer}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#94a3b8"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
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