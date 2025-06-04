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
import CheckboxDropdown from "../../components/CheckboxDropdown"; // import your dropdown
import {
  createPetrolPrice,
  updatePetrolPrice,
  getPetrolPrice,
} from "../../components/utils/station";

const FUEL_OPTIONS = ["Regular", "Premium", "Super"];

const CreateAndUpdatePrice = () => {
  const [stationName, setStationName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [fuelPrices, setFuelPrices] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState([]);

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
    if (!stationName || selectedTypes.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please select fuel types and enter prices."
      );
      return;
    }

    const pricesArray = selectedTypes
      .filter((type) => fuelPrices[type])
      .map((type) => ({
        type,
        price: parseFloat(fuelPrices[type]),
      }));

    if (pricesArray.length === 0) {
      Alert.alert(
        "Validation Error",
        "Enter price for at least one fuel type."
      );
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updatePetrolPrice(editingId, {
          stationName,
          prices: pricesArray,
        });
        Alert.alert("Success", "Petrol prices updated.");
      } else {
        await createPetrolPrice({
          stationName,
          prices: pricesArray,
        });
        Alert.alert("Success", "Petrol prices created.");
      }

      setStationName("");
      setSelectedTypes([]);
      setFuelPrices({});
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
    const types = item.priceAndType.map((pt) => pt.type);
    const priceMap = {};
    item.priceAndType.forEach((pt) => {
      priceMap[pt.type] = pt.price.toString();
    });
    setSelectedTypes(types);
    setFuelPrices(priceMap);
    setEditingId(item.id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleEdit(item)}
      className="bg-white px-5 py-6 rounded-2xl mb-4 border border-gray-200 shadow-sm"
    >
      <View className="flex-col items-start">
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {item.stationName}
        </Text>

        <Text className="text-sm text-gray-700 mb-2">
          {item.priceAndType.map((pt) => `${pt.type}: ₦${pt.price}`).join(", ")}
        </Text>

        <Text className="text-sm text-blue-600 font-medium self-end">
          Tap to edit
        </Text>
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

      <CheckboxDropdown
        label="Select Fuel Types"
        options={FUEL_OPTIONS}
        value={selectedTypes}
        onChange={(types) => {
          setSelectedTypes(types);
          const updated = { ...fuelPrices };
          types.forEach((type) => {
            if (!updated[type]) updated[type] = "";
          });
          setFuelPrices(updated);
        }}
      />

      {selectedTypes.map((type) => (
        <ReusableInput
          key={type}
          icon="money"
          label={`${type} Price`}
          value={fuelPrices[type]}
          onChangeText={(text) =>
            setFuelPrices({
              ...fuelPrices,
              [type]: text.replace(/[^0-9.]/g, ""),
            })
          }
          keyboardType="numeric"
        />
      ))}

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
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CreateAndUpdatePrice;
