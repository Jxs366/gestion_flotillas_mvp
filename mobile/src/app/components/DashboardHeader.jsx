import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardHeader({ navigation }) {
  return (
    <View className="flex-row items-center justify-between pr-4 pl-4 bg-white shadow-sm">

      {/* LOGO */}
      <Image
        source={require("../../../assets/images/logo-empresa.png")}
        className="w-40 h-28"
        resizeMode="contain"
      />

      {/* Botón de Menú */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
