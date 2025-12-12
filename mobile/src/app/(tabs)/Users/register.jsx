// app/users/registers.jsx
import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function RegisterUserScreen() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("driver");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const ORANGE = "#ff6600";

  const onRegisterPress = async () => {
    if (isSubmitting) return;
    if (!emailAddress) {
      Alert.alert("Error", "El correo es obligatorio");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();

<<<<<<< HEAD
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/users/invite`;
=======

      // ⚠️ IMPORTANTE: REEMPLAZA CON TU URL DE NGROK ACTUAL
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users/invite`;
>>>>>>> guillermo

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: emailAddress,
          fullName: fullName,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Invitación Enviada",
          `Se ha invitado al usuario como ${selectedRole === "driver" ? "Conductor" : "Administrador"
          }.`,
          [{ text: "Entendido", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", data.message || "No se pudo enviar la invitación");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error de Conexión", "Revisa tu conexión o la URL del servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6">
          <Text className="mt-2 text-3xl font-semibold text-gray-900">
            Invitar Usuario
          </Text>

          <Text className="mt-2 text-gray-600">
            Envía una invitación para que el usuario se registre.
          </Text>

          {/* INPUT NOMBRE */}
          <View className="mt-8">
            <Text className="text-sm font-medium uppercase text-gray-500">
              Nombre
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#9ca3af"
              className="mt-2 w-full rounded-2xl bg-gray-100 border border-gray-300 px-4 py-3 text-base text-gray-900"
            />
          </View>

          {/* INPUT CORREO */}
          <View className="mt-6">
            <Text className="text-sm font-medium uppercase text-gray-500">
              Correo electrónico
            </Text>
            <TextInput
              value={emailAddress}
              onChangeText={(t) => setEmailAddress(t.trim())}
              placeholder="correo@empresa.com"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9ca3af"
              className="mt-2 w-full rounded-2xl bg-gray-100 border border-gray-300 px-4 py-3 text-base text-gray-900"
            />
          </View>

          {/* SELECTOR DE ROL */}
          <View className="mt-6">
            <Text className="text-sm font-medium uppercase text-gray-500 mb-3">
              Asignar Rol
            </Text>

            <View className="flex-row gap-4">
              {/* DRIVER */}
              <TouchableOpacity
                onPress={() => setSelectedRole("driver")}
                style={{
                  backgroundColor:
                    selectedRole === "driver" ? ORANGE : "#f3f4f6",
                  borderColor:
                    selectedRole === "driver" ? ORANGE : "#d1d5db",
                }}
                className="flex-1 py-4 rounded-xl border"
              >
                <Text
                  className={`text-center font-bold ${selectedRole === "driver"
                    ? "text-white"
                    : "text-gray-600"
                    }`}
                >
                  Conductor
                </Text>
              </TouchableOpacity>

              {/* ADMIN */}
              <TouchableOpacity
                onPress={() => setSelectedRole("admin")}
                style={{
                  backgroundColor:
                    selectedRole === "admin" ? "#7e22ce" : "#f3f4f6",
                  borderColor:
                    selectedRole === "admin" ? "#7e22ce" : "#d1d5db",
                }}
                className="flex-1 py-4 rounded-xl border"
              >
                <Text
                  className={`text-center font-bold ${selectedRole === "admin"
                    ? "text-white"
                    : "text-gray-600"
                    }`}
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

          {/* BOTÓN ENVIAR */}
          <TouchableOpacity
            onPress={onRegisterPress}
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? "#ff660088" : ORANGE,
            }}
            className="mt-10 w-full rounded-2xl py-4"
          >
            <Text className="text-center font-semibold text-white">
              {isSubmitting ? "Enviando..." : "Enviar Invitación"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
