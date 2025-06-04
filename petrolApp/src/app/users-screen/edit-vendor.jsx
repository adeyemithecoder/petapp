import { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiUrl } from "../../components/utils/utils";
import ReusableInput from "../../components/ReuseAbleInput";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { useRouter } from "expo-router";

const EditVendorScreen = () => {
  const [loading, setLoading] = useState(false);
  const [isFetchingVendor, setIsFetchingVendor] = useState(true);
  const [vendorId, setVendorId] = useState(null);
  const [vendorImage, setVendorImage] = useState(null);
  const [vendorImageId, setVendorImageId] = useState(null);

  const imageUploaderRef = useRef();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const userData = await AsyncStorage.getItem("userDetails");
        const { id } = JSON.parse(userData);

        const { data } = await axios.get(
          `${apiUrl}/station/vendor-by-owner/${id}`
        );

        setVendorId(data.id);
        setVendorImage(data.image || null);
        setVendorImageId(data.imageId || null);

        reset({
          fullName: data.fullName || "",
          phone: data.phone || "",
          location: data.location || "",
          pms: String(data.pms || ""),
        });
      } catch (error) {
        Alert.alert("Error", "Failed to fetch vendor data");
      } finally {
        setIsFetchingVendor(false);
      }
    };

    fetchVendor();
  }, []);

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      let image = vendorImage;
      let imageId = vendorImageId;

      if (imageUploaderRef.current?.hasNewImage()) {
        const result = await imageUploaderRef.current.uploadImageToServer();
        image = result.image;
        imageId = result.imageId;
      }

      const payload = {
        ...formData,
        pms: Number(formData.pms),
        image,
        imageId,
      };

      await axios.put(`${apiUrl}/station/vendor/${vendorId}`, payload);
      router.push("/users-screen/vendor-list");
      Alert.alert("Success", "Vendor updated successfully");
    } catch (error) {
      console.log("error=", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update vendor"
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

  if (isFetchingVendor) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-xl">Fetching Vendor...</Text>
      </View>
    );
  }

  const inputFields = [
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
      label: "Location (well descriptive)",
      icon: "map-marker",
      rules: { required: "Location is required" },
    },
    {
      name: "pms",
      label: "PMS Price",
      icon: "money",
      keyboardType: "numeric",
      rules: { required: "PMS Price is required" },
    },
  ];

  return (
    <ScrollView className="p-4">
      <ImageUploadComponent
        ref={imageUploaderRef}
        initialImage={vendorImage}
        initialImageId={vendorImageId}
      />

      {inputFields.map(({ name, label, icon, keyboardType, rules }) => (
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

      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-xl mt-4 mb-10"
        onPress={handleSubmit(onSubmit, onError)}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg">
          {loading ? "Updating..." : "Update Vendor"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditVendorScreen;
