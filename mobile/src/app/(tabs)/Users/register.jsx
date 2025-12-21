import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterUserScreen() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("driver");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const BG_PRIMARY = "bg-orange-500";
  const BORDER_PRIMARY = "border-orange-500";
  const TEXT_DARK_GRAY = "text-gray-900";


  const onRegisterPress = async () => {
    if (isSubmitting) return;
    if (!emailAddress) {
      Alert.alert("Error", "El correo es obligatorio");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users/invite`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: emailAddress,
          fullName,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Invitación enviada",
          `Se ha invitado al usuario como ${selectedRole === "driver" ? "Conductor" : "Administrador"
          }.`,
          [{ text: "Entendido", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", data.message || "No se pudo enviar la invitación");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error de conexión", "Revisa tu conexión o la URL del servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const driverActive = selectedRole === "driver";
  const adminActive = selectedRole === "admin";

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6" contentContainerClassName="pb-10">
          {/* Títulos */}
          <Text className="mt-2 text-3xl font-extrabold text-gray-900">
            Invitar usuario
          </Text>
          <Text className="mt-2 text-gray-600">
            Envía una invitación para que el usuario se registre.
          </Text>

          {/* Nombre */}
          <View className="mt-8">
            <Text className="text-sm font-medium uppercase text-gray-600">
              Nombre
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#9ca3af"
              className="mt-2 w-full rounded-xl bg-white border border-gray-300 px-4 py-3 
                                    text-base text-gray-900 shadow-sm"
            />
          </View>

          {/* Correo */}
          <View className="mt-6">
            <Text className="text-sm font-medium uppercase text-gray-600">
              Correo electrónico
            </Text>
            <TextInput
              value={emailAddress}
              onChangeText={(t) => setEmailAddress(t.trim())}
              placeholder="correo@empresa.com"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9ca3af"
              className="mt-2 w-full rounded-xl bg-white border border-gray-300 px-4 py-3 
                                    text-base text-gray-900 shadow-sm"
            />
          </View>

          {/* Asignar rol */}
          <View className="mt-6">
            <Text className="text-sm font-medium uppercase text-gray-600 mb-3">
              Asignar rol
            </Text>
            <View className="flex-row gap-4">

              {/* CONDUCTOR */}
              <TouchableOpacity
                onPress={() => setSelectedRole("driver")}
                className={`flex-1 py-4 rounded-xl border shadow-sm 
                                    ${driverActive ? BG_PRIMARY : "bg-white"} 
                                    ${driverActive ? BORDER_PRIMARY : "border-gray-300"}`}
              >
                <Text
                  className={`text-center font-semibold text-base 
                                        ${driverActive ? "text-white" : "text-gray-700"}`}
                >
                  Conductor
                </Text>
              </TouchableOpacity>

              {/* ADMIN*/}
              <TouchableOpacity
                onPress={() => setSelectedRole("admin")}
                className={`flex-1 py-4 rounded-xl border shadow-sm 
                                    ${adminActive ? "bg-gray-700" : "bg-white"} 
                                    ${adminActive ? "border-gray-700" : "border-gray-300"}`}
              >
                <Text
                  className={`text-center font-semibold text-base 
                                        ${adminActive ? "text-white" : "text-gray-700"}`}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="mt-2 text-xs text-gray-500 text-center">
              {selectedRole === "driver"
                ? "Se creará un registro de conductor."
                : "Tendrá acceso total al panel."}
            </Text>
          </View>

          {/* Botón principal*/}
          <TouchableOpacity
            onPress={onRegisterPress}
            disabled={isSubmitting}
            activeOpacity={0.85}
            className={`mt-10 w-full rounded-xl py-4 shadow-lg ${isSubmitting ? "bg-orange-400/60" : "bg-orange-500"
              }`}
          >
            <Text className="text-center text-lg font-semibold tracking-wide text-white">
              {isSubmitting ? "Enviando..." : "Enviar invitación"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}