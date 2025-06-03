import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const StationList = ({
  loading,
  stations,
  location,
  onRefresh,
  getDistance,
  getAvatarColor,
}) => {
  const renderListItem = ({ item }) => {
    const distance = getDistance(item.coordinates, location);

    const handlePress = () => {
      const [lng, lat] = item.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(url);
    };

    return (
      <TouchableOpacity style={styles.item} onPress={handlePress}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: getAvatarColor(item.name) },
          ]}
        >
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name} {item.price ? `- ₦${item.price}` : ""}
          </Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
        <View style={styles.navigateBtn}>
          <Text style={{ fontSize: 18 }}>➤</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Checking for nearby stations...</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderListItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
      />

      {!loading && stations.length === 0 && (
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <MaterialIcons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  info: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 14 },
  address: { fontSize: 12, color: "#666" },
  distance: { fontSize: 12, marginHorizontal: 6 },
  navigateBtn: { padding: 6 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  refreshButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 4,
    zIndex: 999,
  },
});

export default StationList;
