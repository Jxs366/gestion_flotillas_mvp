import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AssignmentModal({ 
  visible, 
  onClose, 
  data = [], 
  onSelect, 
  title = "Seleccionar Opción",
  emptyMessage = "No hay datos disponibles",
  isLoading = false 
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-3/4 p-4 shadow-2xl">
          
          {/* HEADER DEL MODAL */}
          <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <Text className="text-xl font-bold text-gray-800">{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* CONTENIDO */}
          {data.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Ionicons name="car-outline" size={48} color="#e5e7eb" />
              <Text className="text-gray-400 text-lg mt-3 text-center">{emptyMessage}</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.7}
                  className={`flex-row items-center p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200 ${
                    isLoading ? "opacity-50" : "active:bg-orange-50 active:border-orange-200"
                  }`}
                >
                  {/* Ícono Izquierdo */}
                  <View className="bg-white p-2.5 rounded-full mr-3 shadow-sm">
                    <Ionicons name="car-sport" size={24} color="#ff6600" />
                  </View>

                  {/* Texto Central */}
                  <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-lg">
                      {item.brand} {item.model}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Placa: <Text className="font-mono text-gray-700">{item.plate}</Text> • {item.year}
                    </Text>
                  </View>

                  {/* Botón Acción */}
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#ff6600" />
                  ) : (
                    <Ionicons name="add-circle" size={28} color="#ff6600" />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}