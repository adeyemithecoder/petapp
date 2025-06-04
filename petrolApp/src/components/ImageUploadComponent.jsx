import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { View, Image, TouchableOpacity, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { apiUrl } from "./utils/utils";

const ImageUploadComponent = forwardRef((props, ref) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  // Load initial image
  useEffect(() => {
    if (props.initialImage) {
      setImagePreview(props.initialImage);
      setImageId(props.initialImageId || null);
    }
  }, [props.initialImage, props.initialImageId]);

  useEffect(() => {
    if (props.initialImage) {
      setImagePreview(props.initialImage);
      setImageId(props.initialImageId || null);
    }
  }, [props.initialImage, props.initialImageId]);

  // Let parent call upload method using ref
  useImperativeHandle(ref, () => ({
    uploadImageToServer,
    getImageData: () => ({
      image: imagePreview,
      imageId,
    }),
    clearImage: () => {
      setImagePreview(null);
      setBase64Image(null);
      setImageId(null);
      setHasNewImage(false);
    },
    hasNewImage: () => hasNewImage,
  }));

  const [imageId, setImageId] = useState(null);

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [], // No resize action
      {
        compress: 0.4, // More aggressive compression (0.4 or even 0.3 if needed)
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return result.uri;
  };

  const convertToBase64 = async (uri) => {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Camera roll access is required to upload images."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled) return;

    const originalUri = pickerResult.assets[0].uri;
    const compressedUri = await compressImage(originalUri);
    const base64 = await convertToBase64(compressedUri);
    const imageData = `data:image/jpg;base64,${base64}`;

    setImagePreview(imageData);
    setBase64Image(imageData);
    setImageId(null);
    setHasNewImage(true); // Mark new image selected
  };

  const uploadImageToServer = async () => {
    if (!base64Image) {
      Alert.alert("No Image", "Please select an image first.");
      return null;
    }
    try {
      const { data } = await axios.post(`${apiUrl}/image/upload`, {
        image: base64Image,
      });

      const uploadedData = {
        image: data.secure_url,
        imageId: data.public_id,
      };

      if (props.onUpload) {
        props.onUpload(uploadedData);
      }

      setImagePreview(null);
      setBase64Image(null);
      setImageId(null);
      setHasNewImage(false); // Reset flag
      return uploadedData;
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Error", "Image upload failed.");
      return null;
    }
  };

  return (
    <View className="flex-1 justify-center items-center mb-10">
      {imagePreview ? (
        <View className="relative my-5">
          <Image
            source={{ uri: imagePreview }}
            className="w-[220px] h-[220px] rounded-full"
          />
          <TouchableOpacity
            onPress={pickImage}
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
          >
            <FontAwesome5 name="edit" size={20} color="orange" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} className="items-center">
          <FontAwesome5 name="camera" size={70} color="orange" />
          <Text className="mt-2 text-gray-500">Pick Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default ImageUploadComponent;
