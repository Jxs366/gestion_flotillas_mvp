import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Image } from "react-native";
import { SignOutButton } from "../../components/SignOutButton"; // Ajusta la ruta si es necesario


export default function Dashboard() {
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-10">
        
        {/* Header de Bienvenida */}
        <View className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <Text className="text-sm uppercase tracking-wide text-white/60">
            Bienvenido
          </Text>
          <Text className="mt-2 text-3xl font-semibold text-white">
            {user?.firstName || "Conductor"}
          </Text>
          <Text className="mt-6 text-base text-white/80">
            Selecciona una opción en el menú inferior para gestionar tu flota.
          </Text>
        </View>
        {/* Aquí puedes poner métricas o resumenes rápidos en lugar de botones de navegación */}
        
        <SignOutButton />
        
      </ScrollView>
    </SafeAreaView>
  );
}