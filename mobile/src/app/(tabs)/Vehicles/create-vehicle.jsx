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
  StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function CreateVehicleScreen() {
  const { getToken } = useAuth()

  const [vin, setVin] = useState("")
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [plate, setPlate] = useState("")
  const [odometer, setOdometer] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Definiciones de color y estilo
  const TEXT_DARK = "text-gray-800";
  const TEXT_MUTED = "text-gray-600";
  const BG_APP = "bg-gray-100";
  const PRIMARY_COLOR_BG = "bg-orange-500";
  const BORDER_SECONDARY = "border-gray-400";
  const TEXT_SECONDARY = "text-gray-700";

  async function saveVehicle() {
    if (!vin || !make || !model || !plate) {
      Alert.alert("Campos incompletos", "Por favor ingresa al menos VIN, Marca, Modelo y Placa.")
      return
    }

    try {
      setIsSaving(true)
      const token = await getToken()

      const res = await fetch("https://sensately-nonlaminable-tempie.ngrok-free.dev/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vin,
          plate,
          make,
          model,
          year,
          current_odometer: parseInt(odometer) || 0,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "No se pudo guardar el vehículo")

      setVin("")
      setMake("")
      setModel("")
      setYear("")
      setPlate("")
      setOdometer("")

      Alert.alert("Vehículo registrado", "Se guardó correctamente 🎉")
    } catch (err) {
      Alert.alert("Error", err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView className={`flex-1 ${BG_APP}`}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="px-6 pb-10"
        >

          {/*HEADER*/}
          <View className="mb-6">
            <Text className={`text-sm uppercase tracking-wider ${TEXT_MUTED}`}>
              Nuevo registro
            </Text>
            <Text className={`mt-1 text-3xl font-extrabold text-gray-900`}>
              Agrega un vehículo
            </Text>
            <Text className={`mt-2 ${TEXT_MUTED}`}>
              Ingresa los datos técnicos de la unidad.
            </Text>
          </View>

          {/* FORMULARIO */}
          <View className="mt-2 gap-6">

            {/* VIN */}
            <View>
              <Text className={`text-sm font-medium uppercase ${TEXT_MUTED}`}>
                VIN (Número de Serie) *
              </Text>
              <TextInput
                value={vin}
                onChangeText={(t) => setVin(t.toUpperCase())}
                placeholder="Ej. 1HGCM826..."
                placeholderTextColor="#9ca3af"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm"
              />
            </View>

            {/* MARCA - MODELO */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className={`text-sm font-medium uppercase ${TEXT_MUTED}`}>
                  Marca *
                </Text>
                <TextInput
                  value={make}
                  onChangeText={setMake}
                  placeholder="Toyota"
                  placeholderTextColor="#9ca3af"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm"
                />
              </View>

              <View className="flex-1">
                <Text className={`text-sm font-medium uppercase ${TEXT_MUTED}`}>
                  Modelo *
                </Text>
                <TextInput
                  value={model}
                  onChangeText={setModel}
                  placeholder="Hilux"
                  placeholderTextColor="#9ca3af"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm"
                />
              </View>
            </View>

            {/* AÑO - PLACA */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className={`text-sm font-medium uppercase ${TEXT_MUTED}`}>
                  Año
                </Text>
                <TextInput
                  value={year}
                  onChangeText={setYear}
                  placeholder="2023"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm"
                />
              </View>

              <View className="flex-1">
                <Text className={`text-sm font-medium uppercase ${TEXT_MUTED}`}>
                  Placa *
                </Text>
                <TextInput
                  value={plate}
                  onChangeText={(t) => setPlate(t.toUpperCase())}
                  placeholder="ABC1234"
                  autoCapitalize="characters"
                  placeholderTextColor="#9ca3af"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 tracking-widest shadow-sm"
                />
              </View>
            </View>

            {/* ODOMETRO */}
            <View>
              <Text className={`text-sm font-medium uppercase ${TEXT_MUTED}`}>
                Kilometraje Inicial
              </Text>
              <TextInput
                value={odometer}
                onChangeText={setOdometer}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm"
              />
            </View>

          </View>

          {/* BOTONES */}
          <View className="mt-10 gap-4">
            {/* BOTÓN GUARDAR */}
            <TouchableOpacity
              onPress={saveVehicle}
              disabled={isSaving}
              activeOpacity={0.85}
              className={`w-full rounded-xl py-4 shadow-lg ${isSaving ? "bg-orange-400/60" : PRIMARY_COLOR_BG
                }`}
            >
              <Text className="text-center text-lg font-semibold tracking-wide text-white">
                {isSaving ? "Guardando..." : "Guardar vehículo"}
              </Text>
            </TouchableOpacity>

            {/* BOTÓN SECUNDARIO */}
            <Link href="/Vehicles" replace asChild>
              <TouchableOpacity className={`w-full rounded-xl border ${BORDER_SECONDARY} py-4 bg-white shadow-sm`}>
                <Text className={`text-center text-lg font-semibold tracking-wide ${TEXT_SECONDARY}`}>
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