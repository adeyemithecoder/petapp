import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import ReusableInput from "../../components/ReuseAbleInput";
import {
  createPetrolPrice,
  updatePetrolPrice,
  getPetrolPrice,
} from "../../components/utils/station";

const CreateAndUpdatePrice = () => {
  const [stationName, setStationName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState([]);

  // Fetch existing petrol prices
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await getPetrolPrice();
      setPrices(data);
    } catch (err) {
      console.error("Failed to fetch prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSubmit = async () => {
    if (!stationName || !price) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updatePetrolPrice(editingId, {
          stationName,
          price: parseFloat(price),
        });
        Alert.alert("Success", "Petrol price updated.");
      } else {
        await createPetrolPrice({
          stationName,
          price: parseFloat(price),
        });
        Alert.alert("Success", "Petrol price created.");
      }

      // Reset form and refresh list
      setStationName("");
      setPrice("");
      setEditingId(null);
      fetchPrices();
    } catch (err) {
      console.error("Error submitting price:", err.message);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setStationName(item.stationName);
    setPrice(item.price.toString());
    setEditingId(item.id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleEdit(item)}
      className="bg-white px-4 py-5 rounded-2xl mb-3 border border-gray-200 shadow-sm"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-semibold text-gray-900">
            {item.stationName}
          </Text>
          <Text className="text-sm text-gray-500">Tap to edit</Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-700 font-semibold text-base">
            ₦{item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-4">
        Create or Update Petrol Price
      </Text>

      <ReusableInput
        icon="building"
        label="Station Name"
        value={stationName}
        onChangeText={setStationName}
      />

      <ReusableInput
        icon="money"
        label="Price (₦)"
        value={price}
        onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 py-3 rounded-xl mb-6 mt-4"
      >
        <Text className="text-center text-white font-semibold">
          {editingId ? "Update Price" : "Create Price"}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={prices}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default CreateAndUpdatePrice;
