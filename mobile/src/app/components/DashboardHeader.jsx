import { View, TouchableOpacity, Image, Modal, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function DashboardHeader({ navigation }) {
  const { signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View className="flex-row items-center justify-between pr-4 pl-4 bg-white">

      {/* LOGO */}
      <Image
        source={require("../../../assets/images/logo-empresa.png")}
        className="w-40 h-28"
        resizeMode="contain"
      />

      {/* Botón de Menú (3 puntitos) */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={32} color="#333" />
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
          <View className="absolute top-20 right-5 bg-white rounded-xl p-3 border border-gray-200">

            <TouchableOpacity
              className="p-2"
              onPress={() => {
                setMenuVisible(false);
                signOut();
              }}
            >
              <Text className="text-gray-800 text-base">Cerrar sesión</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}