import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// import OilGasNews from "@/src/components/OilGasNews";
import { useFocusEffect, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPetrolPrice } from "../../../components/utils/station";

const Menu = () => {
  const router = useRouter();

  const segments = useSegments();
  const [highestPrice, setHighestPrice] = useState(0);
  const [lowestPrice, setLowestPrice] = useState(0);
  const quickActions = [
    {
      label: "Nearby Station",
      icon: "gas-pump",
      onPress: () => router.push("/users/nearbyStation"),
    },
    {
      label: "Market Place",
      icon: "store",
      onPress: () => router.push("/users/marketPlace"),
    },
    {
      label: "Latest News",
      icon: "newspaper",
      onPress: () => router.push("/users/news"),
    },
    {
      label: "Your Orders",
      icon: "shopping-basket",
      onPress: () => router.push("/users-screen/user-orders"),
    },
    {
      label: "Testimonial",
      icon: "comments",
      onPress: () => router.push("/users-screen/testimonial"),
    },

    {
      label: "Advert",
      icon: "bullhorn",
      onPress: () => router.push("/users-screen/advert"),
    },
    {
      label: "Vendor",
      icon: "user-tag",
      onPress: () => router.push("/users-screen/vendor"),
    },
  ];

  useEffect(() => {
    const backAction = () => {
      // Check if user is at the main dashboard and trying to go back
      if (
        segments.length === 2 &&
        segments[0] === "users" &&
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
        return true;
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

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (!userDetails) {
          router.replace("/sign-in");
        }
      } catch (error) {
        console.log("Error checking login status:", error);
        router.replace("/sign-in");
      }
    };
    checkLoginStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchPrices = async () => {
        try {
          const data = await getPetrolPrice();
          if (data.length > 0) {
            const sorted = [...data].sort((a, b) => a.price - b.price);
            // Lowest and highest prices
            const lowest = sorted[0];
            const highest = sorted[sorted.length - 1];

            setLowestPrice(lowest); // e.g., { price: 850, stationName: "Texaco" }
            setHighestPrice(highest); // e.g., { price: 1000, stationName: "Eterna" }
          }
        } catch (error) {
          console.log("Error fetching prices:", error);
        }
      };

      fetchPrices();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <LinearGradient
        colors={["#00C6FF", "#0072FF"]}
        className="rounded-xl p-4 mb-4 mt-5"
      >
        <Text className="text-white text-xl font-semibold">
          Latest Market Price
        </Text>
      </LinearGradient>

      {/* Prices Section */}
      <View className="bg-white p-4 rounded-2xl shadow-lg flex-1 mr-2">
        <View className="flex flex-row justify-between items-start mb-4">
          <Text className="text-gray-700 text-lg font-semibold">PMS</Text>
        </View>

        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-lg">High Price</Text>
          <Text className="text-xl font-bold text-gray-800">
            ₦{highestPrice.price} @ {highestPrice.stationName}
          </Text>
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-lg">Best Price</Text>
          <Text className="text-xl font-bold text-green-600">
            ₦{lowestPrice.price} @ {lowestPrice.stationName}
          </Text>
        </View>
      </View>

      {/* Quick Actions - FIXED */}
      <View className="my-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </Text>

        <View className="flex-row flex-wrap -mx-2">
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="w-1/3 px-2 mb-4"
            >
              <View className="bg-white p-4 rounded-lg shadow-md items-center">
                <FontAwesome5 name={item.icon} size={24} color="#0072FF" />
                <Text className="text-gray-600 text-center">{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* <View className="my-1 ">
        <OilGasNews />
      </View> */}
    </ScrollView>
  );
};

export default Menu;
