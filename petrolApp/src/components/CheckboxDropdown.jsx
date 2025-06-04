import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Checkbox } from "react-native-paper";

const CheckboxDropdown = ({ label, options = [], value = [], onChange }) => {
  const [visible, setVisible] = useState(false);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const toggleCheckbox = (item) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <View className="mb-10">
      {label && <Text className="font-bold mb-1.5">{label}</Text>}

      <TouchableOpacity
        className="border border-gray-300 p-3 rounded"
        onPress={toggleDropdown}
      >
        <Text>
          {value.length > 0 ? value.join(", ") : `Select ${label || "options"}`}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View className="flex-1 bg-black/40" />
        </TouchableWithoutFeedback>

        <View className="absolute top-[30%] left-[10%] w-[80%] bg-white rounded-xl p-5">
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              className="flex-row items-center mb-2.5"
              onPress={() => toggleCheckbox(option)}
            >
              <Checkbox
                status={value.includes(option) ? "checked" : "unchecked"}
              />
              <Text className="ml-2">{option}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="bg-blue-600 p-3 rounded items-center mt-4"
            onPress={toggleDropdown}
          >
            <Text className="text-white font-bold">Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default CheckboxDropdown;
