import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, Alert, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiUrl } from "../../components/utils/utils";
import ReusableInput from "../../components/ReuseAbleInput";
import CheckboxDropdown from "../../components/CheckboxDropdown";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { useRouter } from "expo-router";

const CreateVendorScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const imageUploaderRef = useRef();
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

    const { image, imageId } =
      await imageUploaderRef.current.uploadImageToServer();

    const payload = {
      ...data,
      userId,
      image,
      imageId,
      fuelTypes: data.fuelTypes || [],
    };

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/vendor/create`, payload);
      Alert.alert("Success", "Vendor registered successfully");
      router.push("/users/dashboard");
      reset();
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
      <ImageUploadComponent ref={imageUploaderRef} />

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

      {/* Fuel Types */}
      <Controller
        control={control}
        name="fuelTypes"
        rules={{
          validate: (v) => v?.length > 0 || "Select at least one fuel type",
        }}
        render={({ field: { onChange, value } }) => (
          <CheckboxDropdown
            label="Fuel Types Sold"
            options={["PMS", "AGO", "DPK"]}
            value={value || []}
            onChange={onChange}
          />
        )}
      />

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
    </ScrollView>
  );
};

export default CreateVendorScreen;
