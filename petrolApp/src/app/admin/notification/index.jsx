import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import SearchAndSort from "../../../components/SearchAndSort";
import { fetchUsers } from "../../../redux/slices/userSlice";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { sendNotificationToManyUsers } from "../../../components/utils/users";

export default function NotificationScreen() {
  const [sending, setSending] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const SendNewsUpdate = async () => {
    try {
      setSending(true);
      await sendNotificationToManyUsers({
        title: "🛢️ Petrol News Update",
        body: "Click to see the latest petrol news.",
        data: {
          screen: "/users/news",
          image:
            "https://leadership.ng/wp-content/uploads/2022/06/fuel-attendant.webp",
        },
      });
      Alert.alert("Success", "Notification sent!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const SendPriceUpdate = async () => {
    try {
      setIsSending(true);
      await sendNotificationToManyUsers({
        title: "🛢️ Petrol Price Update",
        body: "Click to see the latest petrol price.",
        data: {
          screen: "/users/dashboard",
          image:
            "https://leadership.ng/wp-content/uploads/2022/06/fuel-attendant.webp",
        },
      });
      Alert.alert("Success", "Notification sent!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const users = useSelector((state) => state.users.filteredUsers);
  const loading = useSelector((state) => state.users.loading); // <-- Get loading state

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-xl">Loading users...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <SearchAndSort />

      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-lg items-center mb-2"
        onPress={SendNewsUpdate}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base">
            Send News Notification to All
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-lg items-center mb-4"
        onPress={SendPriceUpdate}
        disabled={isSending}
      >
        {isSending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base">
            Send Price Notification to All
          </Text>
        )}
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full bg-white shadow-md rounded-lg ">
          {/* Table Header */}
          <View className="flex-row border-b border-gray-300 p-3 bg-gray-200">
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left">
              Name
            </Text>
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left">
              Status
            </Text>
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left">
              Phone
            </Text>
          </View>

          {/* Table Rows */}
          {users.map((user, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/admin/notification/${user.id}`)}
            >
              <View className="flex-row border-b border-gray-300 p-3 items-center">
                <View className="w-[35%] px-1">
                  <Text className="font-bold text-base">{user.name}</Text>
                  <Text className="text-gray-500 text-sm">{user.email}</Text>
                </View>
                <View className="w-1/3 px-1">
                  {(() => {
                    const lastActiveDate = new Date(user.lastActive);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                    const isRecentlyActive = lastActiveDate > oneWeekAgo;
                    const displayStatus = isRecentlyActive
                      ? "Active"
                      : "Inactive";
                    const statusColor = isRecentlyActive
                      ? "text-green-500"
                      : "text-red-500";

                    return (
                      <Text className={`font-bold text-lg ${statusColor}`}>
                        {displayStatus}
                      </Text>
                    );
                  })()}

                  <Text className="text-gray-500 text-xs">
                    Last login:{" "}
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleString()
                      : "No login yet"}
                  </Text>
                </View>
                <View className="w-1/3 px-1">
                  <Text className="font-bold">{user.phone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
