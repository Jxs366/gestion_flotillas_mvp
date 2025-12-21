import { View, TouchableOpacity, Image, Modal, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function DashboardHeader({ navigation }) {
  const { signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">

      {/* LOGO */}
      <Image
        source={require("../../../assets/images/logo-empresa.png")}
        className="w-48 h-16"
        resizeMode="contain"
      />

      {/* Botón de Menú */}
      <TouchableOpacity onPress={() => setMenuVisible(true)} className="p-1">
        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
      </TouchableOpacity>

      {/* MENÚ MODAL */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/20"
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View className="absolute top-16 right-3 bg-white rounded-xl p-2 shadow-lg border border-gray-100 z-50">

            <TouchableOpacity
              className="px-3 py-2 flex-row items-center"
              onPress={() => {
                setMenuVisible(false);
                signOut();
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
              <Text className="text-gray-800 text-base font-medium ml-2 text-red-500">
                Cerrar sesión
              </Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}