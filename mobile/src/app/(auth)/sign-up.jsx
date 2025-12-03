import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !code) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 px-6 pb-12 pt-16">
          <Text className="text-sm uppercase tracking-wide text-white/60">
            Último paso
          </Text>
          <Text className="mt-2 text-4xl font-semibold text-white">
            Verifica tu correo
          </Text>
          <Text className="mt-3 text-white/70">
            Ingresa el código que enviamos a {emailAddress}.
          </Text>

          <TextInput
            value={code}
            onChangeText={(value) => setCode(value.trim())}
            keyboardType="number-pad"
            placeholder="000000"
            placeholderTextColor="#94a3b8"
            className="mt-10 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center text-2xl font-semibold tracking-[0.5em] text-white"
          />

          <TouchableOpacity
            onPress={onVerifyPress}
            activeOpacity={0.85}
            className="mt-10 w-full rounded-2xl bg-emerald-500 py-4 shadow-lg shadow-emerald-500/30"
          >
            <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
              Verificar código
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <View className="flex-1 px-6 pb-12 pt-16">
          <Text className="text-sm uppercase tracking-wide text-white/60">
            Control vehicular
          </Text>
          <Text className="mt-2 text-4xl font-semibold text-white">
            Crea tu cuenta
          </Text>
          <Text className="mt-3 text-white/70">
            Registra tus datos para mantener el control total de tus vehículos.
          </Text>
          <View>
            <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
              Nombre Completo
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#94a3b8"
              autoCapitalize="words" // Capitaliza cada palabra
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
            />
          </View>
          <View className="mt-10 gap-6">
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Correo electrónico
              </Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                placeholder="nombre@empresa.com"
                placeholderTextColor="#94a3b8"
                onChangeText={(email) => setEmailAddress(email.trim())}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
              />
            </View>
            <View>
              <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                Contraseña
              </Text>
              <TextInput
                value={password}
                placeholder="Elige una contraseña segura"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                onChangeText={(value) => setPassword(value)}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={isSubmitting}
            activeOpacity={0.85}
            className={`mt-10 w-full rounded-2xl py-4 shadow-lg shadow-emerald-500/30 ${
              isSubmitting ? "bg-emerald-500/50" : "bg-emerald-500"
            }`}
          >
            <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
              {isSubmitting ? "Creando cuenta..." : "Continuar"}
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center gap-2">
            <Text className="text-white/70">¿Ya tienes cuenta?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="font-semibold text-emerald-400">
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
