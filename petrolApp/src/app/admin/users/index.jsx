import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import SearchAndSort from "../../../components/SearchAndSort";
import { fetchUsers } from "../../../redux/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const users = useSelector((state) => state.users.filteredUsers);
  const loading = useSelector((state) => state.users.loading);

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
    <View className="flex-1 bg-gray-100 p-2 ">
      <SearchAndSort />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full shadow-md rounded-lg bg-white">
          {/* Table Header */}
          <View className="flex-row border-b border-gray-300 p-3 bg-gray-200">
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left ">
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
              onPress={() => router.push(`/admin/users/${user.id}`)}
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
                <View className="w-1/3 px-1 ">
                  <Text className="font-bold">{user.phone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Users;
