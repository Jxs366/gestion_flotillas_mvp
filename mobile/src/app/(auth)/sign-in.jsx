import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, StatusBar } from "react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [code, setCode] = React.useState("");
  const [isSecondFactor, setIsSecondFactor] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const PRIMARY_COLOR_BG = "bg-orange-500";
  const PRIMARY_COLOR_TEXT = "text-orange-600";
  const PRIMARY_COLOR_SHADOW = "shadow-orange-500/30";
  const BG_APP = "bg-gray-100";

  // LOGIN 
  const onSignInPress = async () => {
    if (!isLoaded || isSubmitting) return;

    if (!isSecondFactor && (!emailAddress || !password)) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else if (signInAttempt.status === "needs_second_factor") {
        const emailFactor = signInAttempt.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code"
        );

        if (emailFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });

          setIsSecondFactor(true);
          Alert.alert("Verificación", "Hemos enviado un código de seguridad a tu correo.");
        } else {
          Alert.alert("Advertencia", "Tu cuenta requiere verificación, pero no hay método disponible.");
        }
      } else {
        Alert.alert("Advertencia", "Estado del login: " + signInAttempt.status);
      }
    } catch (err) {
      const errorMessage = err.errors ? err.errors[0].longMessage : err.message;
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !code) {
      Alert.alert("Error", "Ingresa el código enviado a tu correo.");
      return;
    }

    try {
      setIsSubmitting(true);

      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert("Error", "El código es incorrecto o expiró.");
      }
    } catch (err) {
      const errorMessage = err.errors ? err.errors[0].longMessage : "Código inválido.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${BG_APP}`}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center p-6">

          <View className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-8 min-h-[520px] justify-between">

            <View className="items-center">
              <View className="bg-orange-500/10 rounded-full p-3 mb-3">
                <Ionicons name="car-sport-outline" size={36} color="#ff6600" />
              </View>

              <Text className="text-center text-sm uppercase tracking-wider text-gray-600">
                Control vehicular
              </Text>

              <Text className="mt-1 text-3xl font-extrabold text-gray-900 text-center">
                {isSecondFactor ? "Verificación" : "Iniciar Sesión"}
              </Text>

              <Text className="mt-3 text-gray-700 text-center">
                {isSecondFactor
                  ? `Ingresa el código enviado a ${emailAddress}`
                  : "Accede a tus credenciales de flota."}
              </Text>
            </View>

            {/* FORMULARIO */}
            <View className="mt-14
             gap-9 flex-1">

              {!isSecondFactor && (
                <>
                  <View>
                    <Text className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-2">
                      Correo electrónico
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={emailAddress}
                      placeholder="nombre@empresa.com"
                      placeholderTextColor="#9ca3af"
                      onChangeText={(value) => setEmailAddress(value.trim())}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 shadow-sm"
                    />
                  </View>

                  <View>
                    <Text className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-2">
                      Contraseña
                    </Text>
                    <TextInput
                      value={password}
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                      onChangeText={setPassword}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 shadow-sm"
                    />
                  </View>
                </>
              )}

              {isSecondFactor && (
                <View>
                  <Text className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-1">
                    Código de Seguridad
                  </Text>
                  <TextInput
                    value={code}
                    placeholder="123456"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    maxLength={6}
                    onChangeText={setCode}
                    style={{ includeFontPadding: false, verticalAlign: 'middle' }}
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-xl text-gray-900 text-center tracking-widest font-bold shadow-sm"
                  />
                </View>
              )}
            </View>

            {/* BOTÓN PRINCIPAL */}
            <TouchableOpacity
              onPress={isSecondFactor ? onVerifyPress : onSignInPress}
              disabled={isSubmitting}
              className={`w-full rounded-xl py-4 shadow-lg ${PRIMARY_COLOR_SHADOW} ${isSubmitting ? "bg-orange-500/50" : PRIMARY_COLOR_BG
                }`}
            >
              <Text className="text-center text-lg font-semibold tracking-wide text-white">
                {isSubmitting
                  ? "Procesando..."
                  : isSecondFactor
                    ? "Verificar Dispositivo"
                    : "Continuar"}
              </Text>
            </TouchableOpacity>

            {/* ENLACES SECUNDARIOS */}
            {isSecondFactor && (
              <View className="mt-3 gap-4">
                <TouchableOpacity onPress={onSignInPress} disabled={isSubmitting}>
                  <Text className={`text-center ${PRIMARY_COLOR_TEXT} font-semibold`}>
                    ¿No llegó el correo? Reenviar código
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setIsSecondFactor(false);
                    setIsSubmitting(false);
                  }}
                >
                  <Text className="text-center text-gray-500 font-medium">
                    Cancelar y volver
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}