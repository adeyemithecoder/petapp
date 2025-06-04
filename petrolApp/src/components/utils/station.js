import { apiUrl } from "./utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const getStations = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/station`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getStationById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const deleteStation = async (id) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/station/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getStationDetails = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/details/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getStationByOwner = async () => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userData);
    const { data } = await axios.get(`${apiUrl}/station/by-owner/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

// Create Petrol Price
export const createPetrolPrice = async (priceData) => {
  try {
    const { data } = await axios.post(`${apiUrl}/station/price`, priceData);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create petrol price.";
    throw new Error(errorMessage);
  }
};

// Update Petrol Price
export const updatePetrolPrice = async (id, priceData) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/station/price/${id}`,
      priceData
    );
    return data;
  } catch (error) {
    console.error("Error updating petrol price:", error.message);
    throw error;
  }
};

// Get All Petrol Prices
export const getPetrolPrice = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/price`);
    return data;
  } catch (error) {
    console.error("Error fetching petrol prices:", error.message);
    throw error;
  }
};

export const getVendorByUser = async () => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userData);
    const { data } = await axios.get(`${apiUrl}/station/vendor-by-owner/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};
export const getVendors = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/vendor`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getVendorById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/vendor/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};
