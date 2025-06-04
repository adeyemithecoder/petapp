import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getVendors } from "../../components/utils/station";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchVendors = async () => {
        try {
          setLoading(true);
          const data = await getVendors();
          setVendors(data);
        } catch (error) {
          console.log("Error fetching vendors:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendors();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-xl">Loading vendors...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/users-screen/vendor-details",
          params: { id: item.id },
        })
      }
    >
      <View className="bg-white p-4 rounded-2xl mb-4 shadow shadow-black/10">
        {/* Vendor Image */}
        <Image
          source={
            item?.image
              ? { uri: item.image }
              : require("@/assets/images/vendor.jpeg")
          }
          className="w-full h-48 rounded-xl mb-3"
          resizeMode="cover"
        />

        {/* Vendor Name */}
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {item.fullName}
        </Text>

        {/* Location */}
        <View className="flex-row items-center mb-1">
          <FontAwesome5 name="map-marker-alt" size={14} color="#6C63FF" />
          <Text className="ml-2 text-sm text-gray-600">{item.location}</Text>
        </View>

        {/* Contact */}
        <View className="flex-row items-center mb-1">
          <FontAwesome5 name="phone" size={14} color="#6C63FF" />
          <Text className="ml-2 text-sm text-gray-600">{item.phone}</Text>
        </View>

        {/* PMS Price */}
        <View className="flex-row items-center mt-2">
          <FontAwesome5 name="gas-pump" size={14} color="#444" />
          <Text className="ml-2 text-sm text-gray-700 font-semibold">
            PMS Price: ₦{item.pms}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        className="rounded-lg overflow-hidden mt-5 mx-4 mb-5"
        onPress={() => router.push("/users-screen/vendor")}
      >
        <LinearGradient
          colors={["#00C6FF", "#0072FF"]}
          className="px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-lg text-center font-semibold">
            Register as a Vendor
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default VendorList;
