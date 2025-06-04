import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const VendorTerms = () => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-gray-700 mb-4">
        These terms and conditions govern your access to and use of Splantom
        PetrolApp as a registered vendor. By creating a vendor account, you
        agree to comply with these terms.
      </Text>

      <Text className="text-lg font-bold text-black">1. Eligibility</Text>
      <Text className="text-gray-700 mb-4">
        Only individuals or entities authorized to distribute fuel or petroleum
        products are eligible to register as vendors. Verification may be
        required.
      </Text>

      <Text className="text-lg font-bold text-black">
        2. Accurate Vendor Information
      </Text>
      <Text className="text-gray-700 mb-4">
        You must provide truthful and accurate information, including contact
        details, location, and fuel pricing. Inaccurate information may result
        in suspension of your vendor profile.
      </Text>

      <Text className="text-lg font-bold text-black">
        3. Order Fulfillment and Conduct
      </Text>
      <Text className="text-gray-700 mb-4">
        Vendors are expected to respond promptly to fuel requests and maintain
        professional conduct during all interactions with station owners and app
        users.
      </Text>

      <Text className="text-lg font-bold text-black">4. Legal Compliance</Text>
      <Text className="text-gray-700 mb-4">
        You agree to comply with all applicable laws and industry regulations
        relating to fuel distribution and vendor operations.
      </Text>

      <Text className="text-lg font-bold text-black">
        5. Privacy and Data Use
      </Text>
      <Text className="text-gray-700 mb-4">
        Vendor information may be visible to platform users (excluding sensitive
        details) to facilitate transactions. All data is handled per our privacy
        policy.
      </Text>

      <Text className="text-lg font-bold text-black">
        6. Platform Integrity
      </Text>
      <Text className="text-gray-700 mb-4">
        Misuse of the platform, including false listings, unfulfilled orders, or
        fraudulent behavior, is grounds for removal from Splantom PetrolApp.
      </Text>

      <Text className="text-lg font-bold text-black">
        7. Termination Policy
      </Text>
      <Text className="text-gray-700 mb-4">
        We reserve the right to suspend or terminate vendor accounts that breach
        these terms or compromise the platform’s integrity and trust.
      </Text>

      <Text className="text-lg font-bold text-black">8. Updates to Terms</Text>
      <Text className="text-gray-700 mb-4">
        These terms may be updated at any time. Continued use of the platform
        indicates your acceptance of any changes.
      </Text>

      <TouchableOpacity
        className="p-4 rounded-xl bg-green-600 mb-14"
        onPress={() => router.push("/users-screen/create-vendor")}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Agree and Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VendorTerms;
