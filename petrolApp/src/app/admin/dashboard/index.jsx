import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllUsersSummary } from "../../../components/utils/users";

const AdminDashboard = () => {
  const router = useRouter();
  const segments = useSegments();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const backAction = () => {
      // Check if user is at the main dashboard and trying to go back
      if (
        segments?.length === 2 &&
        segments[0] === "admin" &&
        segments[1] === "dashboard"
      ) {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            {
              text: "No",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                await AsyncStorage.removeItem("userDetails");
                router.replace("/sign-in");
              },
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back action
      }

      return false; // Allow normal back navigation
    };

    // Add event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup listener on unmount
  }, [segments]);

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        try {
          const userDetails = await AsyncStorage.getItem("userDetails");
          if (!userDetails) {
            router.replace("/sign-in");
            return;
          }
          const users = await getAllUsersSummary();
          setUsers(users);
        } catch (error) {
          console.log(error);
        }
      };

      fetchUsers();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      className="p-4 bg-[#f5f5f5] flex-1"
    >
      {/* Header */}
      <LinearGradient
        colors={["#002F63", "#00509D"]}
        className="rounded-xl p-6 mb-4"
      >
        <Text className="text-white text-xl font-semibold">User Analytics</Text>
      </LinearGradient>

      {/* User Statistics */}
      <View className="bg-white p-4 rounded-2xl shadow-md mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          User Statistics
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {[
            {
              icon: "users",
              label: "Total Users",
              value: users?.totalUsers || 0,
              color: "#00509D",
            },
            {
              icon: "user-check",
              label: "Active Users",
              value: users?.activeUsersCount || 0,
              color: "#28a745",
            },
            {
              icon: "user-plus",
              label: "New Users",
              value: users?.newUsers || 0,
              color: "#17a2b8",
            },
            {
              icon: "user-lock",
              label: "Blocked Users",
              value: users?.blockedUsers || 0,
              color: "#D9534F",
            },
          ].map((item, index) => (
            <View key={index} className="w-1/2 p-2">
              <View className="items-center bg-gray-200 p-4 rounded-xl shadow-sm">
                <FontAwesome5 name={item.icon} size={24} color={item.color} />
                <Text className="text-sm text-gray-600 mt-1">{item.label}</Text>
                <Text className="text-xl font-extrabold text-gray-800">
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-4 bg-white rounded-lg shadow-lg mb-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </Text>

        <View className="flex-row flex-wrap gap-x-4 gap-y-4">
          <TouchableOpacity
            className="w-[30%] items-center"
            onPress={() => router.push("/admin/users")}
          >
            <View className="bg-[#e6f0ff] p-2 rounded-full mb-1">
              <FontAwesome5 name="user-cog" size={25} color="#007bff" />
            </View>
            <Text className="text-gray-800 text-center">Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[30%] items-center"
            onPress={() => router.push("/admin/notification")}
          >
            <View className="bg-[#fff0e6] p-2 rounded-full mb-1">
              <FontAwesome5 name="bell" size={25} color="#ff6600" />
            </View>
            <Text className="text-gray-800 text-center">Notify</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[30%] items-center"
            onPress={() => router.push("/admin-screen/station")}
          >
            <View className="bg-[#e6ffe6] p-2 rounded-full mb-1">
              <FontAwesome5 name="gas-pump" size={25} color="#00cc44" />
            </View>
            <Text className="text-gray-800 text-center">Station</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[30%] items-center"
            onPress={() => router.push("/admin-screen/orders")}
          >
            <View className="bg-[#e6ffe6] p-2 rounded-full mb-1">
              <FontAwesome5 name="shopping-basket" size={25} color="#00cc44" />
            </View>
            <Text className="text-gray-800 text-center">Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[30%] items-center"
            onPress={() => router.push("/admin-screen/price")}
          >
            <View className="bg-[#e6ffe6] p-2 rounded-full mb-1">
              <FontAwesome5 name="money-bill-wave" size={25} color="#00cc44" />
            </View>
            <Text className="text-gray-800 text-center">Price</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
