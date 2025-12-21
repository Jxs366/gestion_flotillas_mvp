import { useAuth } from "@clerk/clerk-expo";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import DashboardHeader from "../../components/DashboardHeader";
import UserCard from "../../components/UserCard";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();

  async function loadUsers() {
    try {
      if (!isLoading) setRefreshing(true);

      const token = await getToken();

      if (!token) {
        setUsers([]);
        return;
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) {
        setUsers([]);
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error.message);
      setUsers([]);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const getUserStatus = (u) => {
    if (u.driver_status) return u.driver_status;
    return "active";
  };

  const activeUsers = users.filter((u) => getUserStatus(u) !== "inactive");
  const inactiveUsers = users.filter((u) => getUserStatus(u) === "inactive");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* HEADER*/}
      <DashboardHeader />

      <View className="flex-1 bg-gray-100">
        <ScrollView
          className="flex-1 px-4"
          contentContainerClassName="pb-32"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadUsers}
              tintColor="#ff6600"
              colors={["#ff6600"]}
            />
          }
        >
          {/*BUSCADOR*/}
          <View className="mt-4 mb-4 gap-3">
            <View className="bg-white flex-row items-center px-4 py-3 rounded-xl shadow-sm border border-gray-300">
              <Ionicons name="search" size={22} color="#888" />
              <Text className="ml-2 text-gray-500">Buscar usuario...</Text>
            </View>

            {/* FILTROS */}
            <View className="flex-row justify-between">
              <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
                <Text className="text-gray-700 font-medium">Estado ▼</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
                <Text className="text-gray-700 font-medium">Rol ▼</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
                <Text className="text-gray-700 font-medium">Ordenar ▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* LOADING / EMPTY */}
          {isLoading && users.length === 0 ? (
            <View className="py-24">
              <ActivityIndicator size="large" color="#ff6600" />
            </View>
          ) : users.length === 0 ? (
            <View className="items-center justify-center py-16 opacity-50">
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text className="text-gray-400 mt-4">No hay usuarios</Text>
            </View>
          ) : (
            <View>
              {/* ACTIVOS */}
              {activeUsers.map((u) => (
                <UserCard key={u.id} user={u} isInactive={false} />
              ))}

              {/* INACTIVOS */}
              {inactiveUsers.length > 0 && (
                <View className="mt-6">
                  <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2">
                    Inactivos ({inactiveUsers.length})
                  </Text>

                  {inactiveUsers.map((u) => (
                    <UserCard key={u.id} user={u} isInactive={true} />
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* BOTÓN FLOTANTE */}
        <Link href="/(tabs)/Users/register" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/40"
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
