import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getStationByOwner } from "../../components/utils/station";
import { useRouter } from "expo-router";

const StationOwner = ({ user, navigation }) => {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStation = async () => {
    try {
      const data = await getStationByOwner();
      setStation(data);
    } catch (error) {
      console.log("No station found or error fetching:", error.message);
      setStation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStation();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!station) {
    return (
      <ScrollView className="flex-1 bg-white px-4 pt-10">
        {/* Breadcrumb */}
        <Text className="text-base text-gray-400 mb-3">
          PetrolApp &gt; Station Setup
        </Text>

        {/* Main Card */}
        <View className="w-full max-w-md bg-gray-50 p-6 rounded-2xl shadow-lg">
          {/* Title */}
          <View className="mb-5">
            <Text className="text-3xl font-extrabold text-gray-800 text-center">
              Welcome to Splantom PetrolApp!
            </Text>
            <Text className="text-lg text-gray-600 mt-3">
              Fuel smarter, grow faster — your station's success starts here.
            </Text>
          </View>

          {/* Body Text */}
          <View className="mb-6">
            <Text className="text-lg text-gray-700 mb-4">
              Splantom PetrolApp helps station owners like you streamline fuel
              ordering, reach more customers, and showcase all the services and
              products your station offers.
            </Text>
            <Text className="text-lg text-gray-700 mb-4">
              Whether you offer car wash, lubricants, tire services, or
              mini-mart items — we make sure people know about it, helping you
              increase visibility and drive more sales.
            </Text>
            <Text className="text-lg text-gray-700">
              Before you continue, please take a moment to read our{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() => router.push("/users-screen/station-owner-terms")}
              >
                Terms and Conditions
              </Text>{" "}
              to understand how we work with you.
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            onPress={() => router.push("/users-screen/station-owner-terms")}
            className="bg-blue-600 py-4 rounded-xl mb-10"
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
          {station.name}
        </Text>
        <Text className="text-sm text-gray-600 mb-1">
          Location: {station.address || "N/A"}
        </Text>
        <Text className="text-sm text-gray-600">
          Updated: {new Date(station.updatedAt).toLocaleDateString()}
        </Text>

        <View className="mt-4 flex flex-col space-y-3">
          <TouchableOpacity
            className="bg-green-500 py-3 px-4 rounded-xl items-center mb-5"
            onPress={() => router.push("/users-screen/station-orders")}
          >
            <Text className="text-white font-semibold">See Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-yellow-400 py-3 px-4 rounded-xl items-center"
            onPress={() => router.push("/users-screen/edit-station")}
          >
            <Text className=" font-semibold">Edit Station</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StationOwner;
