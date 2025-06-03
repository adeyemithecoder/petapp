import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const [loggedInUser, setLoggedInUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const userDetails = await AsyncStorage.getItem("userDetails");
          if (userDetails) {
            const parsedUser = JSON.parse(userDetails);
            setLoggedInUser(parsedUser);
          }
        } catch (error) {
          console.log("Error checking login status:", error);
        }
      };
      checkLoginStatus();
    }, [])
  );

  useEffect(() => {
    if (isSidebarOpen) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }, [isSidebarOpen]);

  const openSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsSidebarOpen(false));
  };

  const router = useRouter();

  const handleNavigation = (screen) => {
    closeSidebar();
    router.push(screen);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userDetails");
              closeSidebar();
              setTimeout(async () => {
                await AsyncStorage.removeItem("userDetails");
                router.replace("/sign-in");
              }, 350);
            } catch (error) {
              console.error("Logout failed", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal transparent visible={isSidebarOpen} animationType="none">
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
        activeOpacity={1}
        onPress={closeSidebar}
      >
        <Animated.View
          style={{
            width: 300,
            backgroundColor: "#fff",
            height: "100%",
            transform: [{ translateX: slideAnim }],
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
          }}
        >
          {/* HEADER SECTION */}
          <LinearGradient
            colors={["#0072FF", "#00C6FF"]}
            style={{
              height: 130,
              alignItems: "center",
              justifyContent: "center",
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              position: "relative",
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={{ position: "absolute", top: 40, right: 20 }}
              onPress={closeSidebar}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>

            <Image
              source={
                loggedInUser?.image
                  ? { uri: loggedInUser.image } // Use network image
                  : require("@/assets/images/admin.jpg") // Fallback
              }
              style={{
                width: 90,
                height: 90,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            />
          </LinearGradient>

          {/* User Info */}
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              {loggedInUser?.name}
            </Text>
            <Text style={{ fontSize: 14, color: "gray" }}>
              {loggedInUser?.email}
            </Text>
          </View>

          <SidebarItem
            icon={<Feather name="user" size={20} color="black" />}
            text="Your Personal Details"
            onPress={() => handleNavigation("/users-screen/user-details")}
          />
          <SidebarItem
            icon={<Feather name="headphones" size={20} color="black" />}
            text="Contact Support"
            onPress={() => handleNavigation("/users-screen/contact")}
          />
          <SidebarItem
            icon={<Feather name="message-square" size={20} color="black" />}
            text="Testimonial"
            onPress={() => handleNavigation("/users-screen/testimonial")}
          />

          {/* Divider */}
          <View
            style={{
              height: 40,
              backgroundColor: "#F4F4F4",
              justifyContent: "center",
              paddingLeft: 20,
              borderTopWidth: 1,
              borderColor: "#E0E0E0",
            }}
          >
            <Text style={{ fontSize: 14, color: "#555", fontWeight: "500" }}>
              Other settings
            </Text>
          </View>

          {/* OTHER SETTINGS */}
          <SidebarItem
            icon={<AntDesign name="infocirlceo" size={20} color="black" />}
            text="About Splantom PetrolApp"
            onPress={() => handleNavigation("/users-screen/about")}
          />
          <SidebarItem
            icon={<Feather name="file-text" size={20} color="black" />}
            text="Terms & Conditions"
            onPress={() => handleNavigation("/users-screen/terms")}
          />
          <SidebarItem
            icon={<MaterialIcons name="privacy-tip" size={20} color="black" />}
            text="Privacy Policy and Terms of Use"
            onPress={() => handleNavigation("/users-screen/privacy")}
          />
          <SidebarItem
            icon={<AntDesign name="delete" size={20} color="red" />}
            text="Delete Account"
            onPress={() => handleNavigation("/users-screen/delete-account")}
          />
          <SidebarItem
            icon={<FontAwesome5 name="gas-pump" size={20} color="green" />}
            text="Station Owner"
            onPress={() => handleNavigation("/users-screen/station-owner")}
          />

          <SidebarItem
            icon={<AntDesign name="logout" size={20} color="red" />}
            text="Logout"
            onPress={handleLogout}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderColor: "#F0F0F0",
    }}
  >
    {icon}
    <Text style={{ marginLeft: 10, fontSize: 16 }}>{text}</Text>
  </Pressable>
);

export default Sidebar;
