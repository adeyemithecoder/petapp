import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiUrl } from "../../components/utils/utils";
import ReusableInput from "../../components/ReuseAbleInput";
import { useRouter } from "expo-router";

const CreateVendorScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("userDetails");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.id);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    if (!userId) return Alert.alert("Error", "User not found");

    const payload = {
      ...data,
      userId,
    };
    console.log("payload=", payload);
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/vendor/create`, payload);
      Alert.alert("Success", "Vendor registered successfully");
      router.push("/users/dashboard");
      reset();
      setSelectedFuelTypes([]);
      setFuelPrices({});
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to register vendor"
      );
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      Alert.alert("Validation Error", firstError.message);
    }
  };

  return (
    <ScrollView className="p-4">
      {/* Basic Fields */}
      {[
        {
          name: "fullName",
          label: "Full Name",
          icon: "user",
          rules: { required: "Full name is required" },
        },
        {
          name: "phone",
          label: "Phone Number",
          icon: "phone",
          keyboardType: "phone-pad",
          rules: { required: "Phone number is required" },
        },
        {
          name: "location",
          label: "Use a well descriptive address",
          icon: "map-marker",
          rules: { required: "Location is required" },
        },
        {
          name: "pms",
          label: "PMS Price",
          keyboardType: "numeric",
          icon: "money",
          rules: { required: "PMS Price is required" },
        },
      ].map(({ name, label, icon, keyboardType, rules }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ReusableInput
              icon={icon}
              label={label}
              value={value}
              onChangeText={onChange}
              keyboardType={keyboardType || "default"}
            />
          )}
        />
      ))}

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-green-600 p-3 rounded-xl mt-4 mb-10"
        onPress={handleSubmit(onSubmit, onError)}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg">
          {loading ? "Registering..." : "Register Vendor"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="green" className="mt-4" />
      )}
    </ScrollView>
  );
};

export default CreateVendorScreen;
