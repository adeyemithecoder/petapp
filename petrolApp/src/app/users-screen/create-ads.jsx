import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import {
  getUserDetails,
  sendNotificationToManyUsers,
} from "../../components/utils/users";
import { LinearGradient } from "expo-linear-gradient";
import { PaystackProvider } from "react-native-paystack-webview";
import PaymentComponent from "../../components/PaymentComponent";
import { confirmPin, createAd, getPricing } from "../../components/utils/ads";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { getConversionRates } from "../../components/utils/utils";

const CreateAds = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [pinSubmitted, setPinSubmitted] = useState(false);
  const [advertPin, setAdvertPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pricingData, setPricingData] = useState([]);
  const [role, setRole] = useState(null);
  const imageUploaderRef = useRef();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Promotion",
    company: "",
  });

  const [conversionRates, setConversionRates] = useState({});
  const [userCountryCurrency, setUserCountryCurrency] = useState("");

  const countryCurrencyMap = {
    Algeria: "DZD",
    Angola: "AOA",
    Australia: "AUD",
    Benin: "XOF",
    Cameroon: "XAF",
    Canada: "CAD",
    Gambia: "GMD",
    Ghana: "GHS",
    "Ivory Coast": "XOF",
    Kenya: "KES",
    Liberia: "LRD",
    Libya: "LYD",
    Mexico: "MXN",
    Nigeria: "NGN",
    "Saudi Arabia": "SAR",
    "South Africa": "ZAR",
    Uganda: "UGX",
    "United Kingdom": "GBP",
    USA: "USD",
    Zimbabwe: "ZWL",
  };

  useFocusEffect(
    useCallback(() => {
      const fetchInitialData = async () => {
        try {
          const user = await getUserDetails();
          if (user) {
            setRole(user.role);
            const userCountry = user.country;
            const currency = countryCurrencyMap[userCountry] || "NGN";
            setUserCountryCurrency(currency);
          }

          const [pricing, rates] = await Promise.all([
            getPricing(),
            getConversionRates(),
          ]);

          setPricingData(pricing);
          setConversionRates(rates);
        } catch (error) {
          console.log("Error:", error);
        }
      };
      fetchInitialData();
    }, [])
  );

  const durationMap = {
    "1w": "One Week",
    "2w": "Two Weeks",
    "1m": "One Month",
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitPin = async () => {
    if (!advertPin) {
      return Alert.alert("Validation Error", "Please enter the advert pin.");
    }
    setSubmitting(true);
    try {
      const user = await getUserDetails();
      await confirmPin(user.email, advertPin);
      setPinSubmitted(true);
    } catch (error) {
      Alert.alert("Error", "Failed to verify pin.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitAd = async () => {
    if (!form.title || !form.description || !form.company) {
      return Alert.alert("Validation Error", "All fields are required.");
    }
    try {
      setloading(true);
      const user = await getUserDetails();
      if (!user) {
        return Alert.alert("Error", "User not found. Please log in again.");
      }

      const { image, imageId } =
        await imageUploaderRef.current.uploadImageToServer();

      const newAd = {
        ...form,
        postedAt: new Date().toISOString(),
        userId: user.id,
        validity: user.pinValidity || "",
        image,
        imageId,
      };
      const res = await createAd(newAd);
      await sendNotificationToManyUsers({
        title: form.title,
        body: "Click for more details.",
        data: {
          screen: "/users/dashboard",
          image,
        },
      });
      Alert.alert("Success", "Ad created successfully.");
      router.back();
    } catch (err) {
      console.error("Ad Creation Error:", err.message);
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setloading(false);
    }
  };

  const convertedPricingData = pricingData.map((item, index) => {
    const rate = conversionRates[userCountryCurrency];
    const convertedAmount = rate ? (item.amount * rate).toFixed(2) : null;

    return {
      ...item,
      index: index + 1,
      durationLabel: durationMap[item.duration] || item.duration,
      convertedAmount,
      currency: userCountryCurrency,
    };
  });

  // 🔸 Welcome and PIN entry screen
  if (role !== "ADMIN" && !pinSubmitted) {
    return (
      <ScrollView className="p-4 bg-white">
        <Text className="text-2xl font-bold mb-4 text-center text-blue-700">
          Welcome to Splantom Petrol Ad Portal
        </Text>

        <Text className="text-gray-800 text-lg font-bold mb-2">
          Thank you for choosing Splantom Petrol App for your advert. Your ad
          will be visible to all users.
        </Text>

        <Text className="mb-2 font-semibold text-lg">Ad Pricing:</Text>

        <View>
          {convertedPricingData.map((item) => (
            <Text key={item.id}>
              {item.index}. {item.durationLabel}: ₦
              {item.amount.toLocaleString()}
              {item.convertedAmount && item.currency !== "NGN" && (
                <>
                  {" "}
                  (~{item.convertedAmount} {item.currency})
                </>
              )}
            </Text>
          ))}
        </View>

        <TextInput
          className="border border-gray-300 rounded p-2 my-4"
          placeholder="Enter Advert PIN sent to your email"
          value={advertPin}
          onChangeText={setAdvertPin}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          className={`rounded-lg overflow-hidden shadow-xl mb-10 ${
            submitting ? "opacity-70" : ""
          }`}
          onPress={submitPin}
          disabled={submitting}
        >
          <LinearGradient
            colors={["#0072FF", "#00C6FF"]}
            className="px-6 py-3 rounded-lg flex-row justify-center items-center"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg text-center font-semibold tracking-wide">
                Proceed to Ad Creation
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View>
          <PaystackProvider
            debug
            publicKey="pk_live_28bbb844c924fed35df06db82c202229c2e14677"
            // currency="NGN"
            defaultChannels={["card", "bank"]}
          >
            <PaymentComponent pricingData={convertedPricingData} />
          </PaystackProvider>
        </View>
      </ScrollView>
    );
  }

  // 🔹 Main Ad Creation Form (already written by you)
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16 }}
    >
      <ImageUploadComponent ref={imageUploaderRef} />

      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        placeholder="Title"
        value={form.title}
        onChangeText={(val) => handleChange("title", val)}
      />

      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(val) => handleChange("description", val)}
      />

      <Text className="mb-1 text-gray-700 font-medium">Category</Text>
      <View className="border border-gray-300 rounded mb-3">
        <Picker
          selectedValue={form.category}
          onValueChange={(val) => handleChange("category", val)}
        >
          <Picker.Item label="Promotion" value="Promotion" />
          <Picker.Item label="Offer" value="Offer" />
          <Picker.Item label="Announcement" value="Announcement" />
        </Picker>
      </View>

      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        placeholder="Company"
        value={form.company}
        onChangeText={(val) => handleChange("company", val)}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        className="rounded-lg overflow-hidden shadow-xl mt-6"
        onPress={submitAd}
        disabled={loading}
      >
        <LinearGradient
          colors={["#0072FF", "#00C6FF"]}
          className="px-6 py-3 rounded-lg"
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-lg text-center font-semibold tracking-wide">
              Submit Ad
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateAds;
