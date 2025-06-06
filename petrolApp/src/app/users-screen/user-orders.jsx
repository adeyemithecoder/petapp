import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { createReview, getOrdersByUserID } from "../../components/utils/ads";
import ReviewModal from "../../components/ReviewModal";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrdersByUserID();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount) =>
    `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
    })}`;

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert("Validation Error", "Please write a review.");
      return;
    }

    try {
      await createReview(reviewText, rating);
      setReviewText("");
      setRating(5);
      setReviewModalVisible(false);
      Alert.alert("Thank you!", "Your review has been submitted.");
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200">
      <Text className="text-lg font-bold text-gray-800 mb-2">
        Order ID: {item.id}
      </Text>
      <Text className="text-gray-600">Customer: {item.userName}</Text>
      <Text className="text-gray-600">Phone: {item.userPhone}</Text>
      <Text className="text-gray-600">Fuel Type: {item.fuelType}</Text>
      <Text className="text-gray-600">Litres: {item.litres}</Text>
      <Text className="text-gray-600">
        Total Amount: {formatCurrency(item.totalAmount)}
      </Text>
      <Text className="text-gray-600">
        Delivery Address: {item.deliveryAddress}
      </Text>
      <Text className="text-gray-600">
        Expected Delivery: {formatDate(item.expectedDateTime)}
      </Text>
      <Text className="text-gray-500 text-sm mt-2">
        Station Name: {item.stationName}
      </Text>
      <Text className="text-gray-500 text-sm mt-2">
        Station Email: {item.stationEmail}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-gray-50">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : orders.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <Text className="text-lg text-gray-500">No order available.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={orders}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />

          {/* Global Write a Review Button */}
          <TouchableOpacity
            className="mt-4 bg-blue-600 rounded-xl p-4 absolute bottom-4 left-4 right-4"
            onPress={() => setReviewModalVisible(true)}
          >
            <Text className="text-white text-center font-bold text-base">
              Write a Review
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        reviewText={reviewText}
        setReviewText={setReviewText}
        rating={rating}
        setRating={setRating}
      />
    </View>
  );
};

export default OrderList;
