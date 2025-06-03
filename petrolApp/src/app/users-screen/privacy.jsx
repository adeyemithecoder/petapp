import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const PrivacyPolicy = () => {
  const phoneNumber = "07032429235";
  const emailAddress = "petapp4all@gmail.com";

  const handleWhatsApp = () => {
    const url = `https://wa.me/234${phoneNumber.slice(1)}`;
    Linking.openURL(url).catch(() => alert("Failed to open WhatsApp"));
  };

  const handleCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => alert("Failed to make a call"));
  };

  const handleEmail = () => {
    const url = `mailto:${emailAddress}`;
    Linking.openURL(url).catch(() => alert("Failed to open email client"));
  };
  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Privacy Policy and Terms of Use
      </Text>

      <Text className="text-sm text-gray-600 mb-2">
        Last updated: June 03, 2025 / Effective Date: June 03, 2025
      </Text>

      <Text className="text-base text-gray-700 mb-4">
        This Privacy Policy describes Our policies and procedures on the
        collection, use and disclosure of Your information when You use the
        Service and tells You about Your privacy rights and how the law protects
        You. We use Your Personal data to provide and improve the Service. By
        using the Service, You agree to the collection and use of information in
        accordance with this Privacy Policy and Terms of Use.
      </Text>

      <Text className="text-base text-gray-700 mb-4">
        These Terms of Use govern your access to and use of our mobile
        application. By using the App, you agree to be bound by these Terms. If
        you do not agree, do not use the App.
      </Text>

      {/* INTERPRETATION AND DEFINITIONS */}
      <Text className="text-xl font-bold text-gray-900 mb-2">
        Interpretation and Definitions
      </Text>

      <Text className="text-lg font-semibold text-gray-800 mb-1">
        Interpretation
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        The words with initial capital letters have defined meanings.
        Definitions apply regardless of singular or plural use.
      </Text>

      <Text className="text-lg font-semibold text-gray-800 mb-1">
        Definitions
      </Text>
      <View className="ml-4 mb-2">
        {[
          "Account means a unique account created for You through the Petrol App (petapp) to access our Service or parts of our Service.",
          "Affiliate means an entity that controls, is controlled by or is under common control with a party, where 'control' means ownership of 50% or more of the shares, equity interest or other securities entitled to vote.",
          "Application refers to PetrolApp, the software program/app provided by the Company.",
          "Company (referred to as either 'the Company', 'We', 'Us' or 'Our') refers to PetrolApp LLC, 1Q2 Road, Benny Rose, Lugbe FCT, Nigeria.",
          "Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
          "Personal Data is any information that relates to an identified or identifiable individual.",
          "Service refers to the Application.",
          "Service Provider refers to third-party companies or individuals employed by the Company to facilitate the Service.",
          "Third-party Social Media Service refers to services like Google, Facebook, Instagram, Twitter, LinkedIn.",
          "Usage Data refers to data collected automatically, such as duration of a page visit.",
          "You means the individual or entity using the Service.",
        ].map((item, index) => (
          <Text key={index} className="text-base text-gray-700 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      {/* ELIGIBILITY */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Eligibility
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        You must be at least 18 years old to use the App. By using the App, you
        represent and warrant that you meet this requirement.
      </Text>

      {/* SERVICES PROVIDED */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Services Provided
      </Text>
      <View className="ml-4 mb-2">
        {[
          "Find and compare fuel prices",
          "Book fuel delivery (if available)",
          "Fulfill and deliver orders",
          "Make secure payments for fuel",
          "Receive fuel price alerts/notifications",
          "View transaction history",
          "Advertise goods/services",
          "Allows petrol/gas stations owners to input current fuel prices",
        ].map((item, index) => (
          <Text key={index} className="text-base text-gray-700 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      {/* USER ACCOUNTS */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        User Accounts
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        You must create an account to use certain features. You agree to provide
        accurate and complete information and to keep it updated.
      </Text>

      {/* PAYMENTS */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Payments
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        Payments are made via third-party processors like Paystack. You agree to
        their terms and authorize charges to your method of payment.
      </Text>

      {/* USER CONDUCT */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        User Conduct
      </Text>
      <View className="ml-4 mb-2">
        {[
          "Use the App for unlawful purposes",
          "Interfere with the operation of the App",
          "Attempt to gain unauthorized access",
          "Accept a fuel order without delivery",
        ].map((item, index) => (
          <Text key={index} className="text-base text-gray-700 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      {/* INTELLECTUAL PROPERTY */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Intellectual Property
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        All content in the App is owned by PetrolApp or its licensors. You may
        not reproduce or distribute it without permission.
      </Text>

      {/* DISCLAIMERS, LIABILITY, TERMINATION */}
      {[
        {
          title: "Disclaimers",
          text: "The App is provided 'as is' without warranties. We do not guarantee fuel availability or price accuracy.",
        },
        {
          title: "Limitation of Liability",
          text: "PetrolApp is not liable for indirect or consequential damages from your use of the App.",
        },
        {
          title: "Termination",
          text: "We may terminate your access to the App at any time, without notice, for any reason.",
        },
      ].map((section, index) => (
        <View key={index} className="mt-6 mb-2">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {section.title}
          </Text>
          <Text className="text-base text-gray-700">{section.text}</Text>
        </View>
      ))}

      {/* REMAINING SECTIONS */}
      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Collecting and Using Your Personal Data
      </Text>
      <Text className="text-lg font-semibold text-gray-800 mb-1">
        Types of Data Collected
      </Text>
      {/* You can continue breaking up the remaining sections the same way using headings and paragraph chunks for readability */}

      <Text className="text-base text-gray-700 mt-4">
        [The rest of the content—such as data sharing, retention, deletion,
        security, children's privacy, legal requirements, and security
        disclosures—should be added below following the same formatting pattern
        to keep the component manageable.]
      </Text>

      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Contact Us
      </Text>

      <Text className="text-base text-gray-700 mb-2">
        If you have any questions about this Privacy Policy/Terms of Use, please
        contact us at:
      </Text>

      {/* WhatsApp Contact */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleWhatsApp}
      >
        <FontAwesome name="whatsapp" size={30} color="#25D366" />
        <Text style={{ fontSize: 18, marginLeft: 15, flex: 1 }}>
          WhatsApp us
        </Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>

      {/* Call Contact */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleCall}
      >
        <FontAwesome name="phone" size={30} color="gray" />
        <Text style={{ fontSize: 18, marginLeft: 15, flex: 1 }}>Call us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>
      {/* Email Contact */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 40,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleEmail}
      >
        <FontAwesome name="envelope" size={28} color="#EA4335" />
        <Text className="text-lg flex-1 ml-4">Email us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PrivacyPolicy;
