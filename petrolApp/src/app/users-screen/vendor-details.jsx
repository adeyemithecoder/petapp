import { View, Text, ScrollView, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getVendorById } from "../../components/utils/station";

const VendorDetails = () => {
  const { id } = useLocalSearchParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getVendorById(id);
        setVendor(data);
      } catch (err) {
        console.log("Failed to fetch vendor");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator className="flex-1 mt-20" size="large" color="#f00" />
    );
  }

  return (
    <ScrollView className="bg-white p-4">
      {/* Vendor Image */}
      <View className="mb-5">
        <Image
          source={
            vendor?.image
              ? { uri: vendor.image }
              : require("@/assets/images/vendor.jpeg")
          }
          className="w-full h-60 rounded-xl"
          resizeMode="contain"
        />
      </View>

      {/* Vendor Name */}
      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">🏢 Business Name</Text>
        <Text className="text-base text-gray-700">{vendor?.fullName}</Text>
      </View>

      {/* Location */}
      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">📍 Location</Text>
        <Text className="text-base text-gray-700">{vendor?.location}</Text>
      </View>

      {/* PMS Price */}
      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">⛽ PMS Price (₦)</Text>
        <Text className="text-base text-gray-700">{vendor?.pms}</Text>
      </View>

      {/* Registration Date */}
      <View className="bg-gray-100 p-4 rounded-xl mb-6 shadow">
        <Text className="text-lg font-semibold mb-1">🕒 Registered On</Text>
        <Text className="text-base text-gray-700">
          {new Date(vendor?.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>

      {/* Contact Section */}
      <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
        👤 Vendor Contact Info
      </Text>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">🧑 Name</Text>
        <Text className="text-base text-gray-700">{vendor?.user?.name}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">✉️ Email</Text>
        <Text className="text-base text-gray-700">{vendor?.user?.email}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">📞 Phone</Text>
        <Text className="text-base text-gray-700">{vendor?.user?.phone}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-6 shadow">
        <Text className="text-lg font-semibold mb-1">🌍 Country</Text>
        <Text className="text-base text-gray-700">{vendor?.user?.country}</Text>
      </View>
    </ScrollView>
  );
};

export default VendorDetails;
