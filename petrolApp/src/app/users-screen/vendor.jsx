import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getVendorByUser } from "../../components/utils/station";

const VendorHome = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchVendor = async () => {
    try {
      const data = await getVendorByUser();
      setVendor(data);
    } catch (error) {
      console.log("No vendor found or error fetching:", error.message);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!vendor) {
    return (
      <ScrollView className="flex-1 bg-white px-4 pt-10">
        <Text className="text-base text-gray-400 mb-3">
          PetrolApp &gt; Vendor Setup
        </Text>

        <View className="w-full max-w-md bg-gray-50 p-6 rounded-2xl shadow-lg">
          <View className="mb-5">
            <Text className="text-3xl font-extrabold text-gray-800 text-center">
              Welcome, Independent Fuel Seller!
            </Text>
            <Text className="text-lg text-gray-600 mt-3 text-center">
              Whether you sell fuel from a mobile tank, roadside kiosk, or mini
              outlet — PetrolApp gives you the tools to reach more customers and
              grow your business.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg text-gray-700 mb-4">
              We’re here to help you showcase your fuel availability, prices,
              and location so nearby buyers can find and trust you easily.
            </Text>
            <Text className="text-lg text-gray-700">
              Before you continue, please review our{" "}
              <Text
                className="text-green-600 underline"
                onPress={() => router.push("/users-screen/vendor-terms")}
              >
                Vendor Terms
              </Text>{" "}
              to understand how the platform works.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/users-screen/vendor-terms")}
            className="bg-green-600 py-4 rounded-xl mb-10"
          >
            <Text className="text-white text-center font-bold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Welcome back!
      </Text>

      <View className="bg-white p-5 rounded-2xl shadow-md">
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          {vendor.fullName}
        </Text>
        <Text className="text-sm text-gray-600 mb-1">
          Phone: {vendor.phone || "N/A"}
        </Text>
        <Text className="text-sm text-gray-600 mb-1">
          Location: {vendor.location || "N/A"}
        </Text>
        <Text className="text-sm text-gray-600">
          PMS Price: ₦{vendor.pms?.toLocaleString() || "N/A"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Updated: {new Date(vendor.updatedAt).toLocaleDateString()}
        </Text>

        <View className="mt-4 flex flex-col space-y-3">
          <TouchableOpacity
            className="bg-yellow-400 py-3 px-4 rounded-xl items-center"
            onPress={() => router.push("/users-screen/edit-vendor")}
          >
            <Text className="font-semibold">Edit Vendor Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VendorHome;
