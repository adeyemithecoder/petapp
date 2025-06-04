import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { getUserById, updateUser } from "../../components/utils/users";
import ReusableInput from "../../components/ReuseAbleInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { useRouter } from "expo-router";

const UserDetails = () => {
  const [loading, setLoading] = useState(false);
  const imageUploaderRef = useRef(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await AsyncStorage.getItem("userDetails");
        if (!userData) {
          Alert.alert("Error", "No user data found.");
          return;
        }

        const parsedUser = JSON.parse(userData);
        const userFromServer = await getUserById(parsedUser.id);

        if (userFromServer) {
          setUser(userFromServer);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (
        !imageUploaderRef.current ||
        !imageUploaderRef.current.uploadImageToServer
      ) {
        throw new Error("Image uploader is not ready.");
      }

      const { image, imageId } =
        await imageUploaderRef.current.uploadImageToServer();
      console.log("image, imageId=", image, imageId);
      const updatedUser = {
        ...user,
        image,
        imageId,
      };

      await updateUser(updatedUser);

      Alert.alert("Success", "User details updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 20 }}
    >
      <View className="items-center">
        <ImageUploadComponent
          ref={imageUploaderRef}
          initialImage={user.image}
          initialImageId={user.imageId}
        />

        <ReusableInput
          icon="user"
          label="Full Name"
          value={user.name || ""}
          onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))}
        />
        <ReusableInput
          icon="envelope"
          label="Email"
          value={user.email || ""}
          onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))}
        />
        <ReusableInput
          icon="map-marker"
          label="Use a well descriptive address"
          value={user.address || ""}
          onChangeText={(text) =>
            setUser((prev) => ({ ...prev, address: text }))
          }
        />
        <ReusableInput
          icon="phone"
          label="Phone Number"
          value={user.phone || ""}
          onChangeText={(text) => setUser((prev) => ({ ...prev, phone: text }))}
        />

        <TouchableOpacity
          className="w-full p-3 rounded-lg flex-row justify-center items-center mt-4"
          style={{
            backgroundColor: loading
              ? "rgba(59, 130, 246, 0.5)"
              : "rgb(59, 130, 246)",
          }}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold">Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserDetails;
