import React, { useEffect, useState, useRef } from "react";
import { View, Alert, PermissionsAndroid, Platform } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import { getPetrolPrice } from "@/src/components/utils/station";
import StationList from "@/src/components/StationList";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoicGV0YXBwNGFsbCIsImEiOiJjbTk3M2ppMWcwMHF3MmxxdDJuZm55aTlwIn0.T8aof4n1b8YpYZPWtnHExg"
);

const NearbyStation = () => {
  const [location, setLocation] = useState([0, 0]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevCoordsRef = useRef([0, 0]);

  const avatarColors = [
    "#007AFF",
    "#FF9500",
    "#34C759",
    "#AF52DE",
    "#FF3B30",
    "#5AC8FA",
    "#5856D6",
  ];

  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  // Merge station data with prices
  const mergeStationsWithPrices = (stationsList, pricesList) => {
    const priceMap = new Map();
    pricesList.forEach((priceItem) => {
      const key = priceItem.stationName.trim().toLowerCase();
      priceMap.set(key, priceItem.priceAndType); // updated to match backend structure
    });

    return stationsList.map((station) => {
      const key = station.name.trim().toLowerCase();
      return {
        ...station,
        priceAndType: priceMap.get(key) || [], // store array of types & prices
      };
    });
  };

  // Get address from coordinates using Mapbox geocoding
  const getAddress = async (lng, lat) => {
    const token =
      "pk.eyJ1IjoicGV0YXBwNGFsbCIsImEiOiJjbTk3M2ppMWcwMHF3MmxxdDJuZm55aTlwIn0.T8aof4n1b8YpYZPWtnHExg";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`;

    try {
      const res = await axios.get(url);
      return res.data.features[0]?.place_name || "Unknown Location";
    } catch (err) {
      console.error("Geocoding error:", err);
      return "Unknown Location";
    }
  };

  // Calculate distance in km between two coordinate points
  const getDistance = ([lng, lat], [userLng, userLat]) => {
    const toRad = (deg) => deg * (Math.PI / 180);
    const R = 6371;
    const dLat = toRad(lat - userLat);
    const dLng = toRad(lng - userLng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchStationsWithPrices = async ([lng, lat]) => {
    setLoading(true);

    const radius = 20000; // 20 km
    const query = `
    [out:json];
    node["amenity"="fuel"](around:${radius},${lat},${lng});
    out;
  `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const priceData = await getPetrolPrice();
      console.log("priceData=", priceData);
      const response = await axios.get(url);
      let stationList = await Promise.all(
        response.data.elements.map(async (el) => {
          const address = await getAddress(el.lon, el.lat);
          return {
            id: el.id,
            coordinates: [el.lon, el.lat],
            name: el.tags?.name || "Petrol Station",
            address,
          };
        })
      );

      // Step 3: Sort stations by distance
      stationList.sort(
        (a, b) =>
          getDistance(a.coordinates, [lng, lat]) -
          getDistance(b.coordinates, [lng, lat])
      );

      // Step 4: Merge stations with prices and set state
      const merged = mergeStationsWithPrices(stationList, priceData);
      setStations(merged);
    } catch (err) {
      console.error("Error fetching stations or prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getDistanceInMeters = ([lng1, lat1], [lng2, lat2]) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371000; // meters
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const handleLocationUpdate = async (loc) => {
      if (!loc?.coords || !isMounted) return;

      const { longitude, latitude } = loc.coords;
      const newCoords = [longitude, latitude];
      const prevCoords = prevCoordsRef.current;

      const distance = getDistanceInMeters(prevCoords, newCoords);

      if (distance >= 50) {
        prevCoordsRef.current = newCoords;
        setLocation(newCoords);
        fetchStationsWithPrices(newCoords);
      }
    };

    const startLocationUpdates = async () => {
      try {
        let hasPermission = true;

        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (hasPermission) {
          MapboxGL.locationManager.start();
          MapboxGL.locationManager.addListener(handleLocationUpdate);
        } else {
          Alert.alert("Permission Denied", "Location permission is required.");
        }
      } catch (err) {
        console.error("Location error:", err);
      }
    };

    startLocationUpdates();

    return () => {
      isMounted = false;
      MapboxGL.locationManager.stop();
      MapboxGL.locationManager.removeListener(handleLocationUpdate);
    };
  }, []);

  // Alert user if location is disabled after 15s of loading
  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Location Disabled",
          "Please turn on your device's GPS/location services and try again."
        );
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <View style={{ flex: 1 }}>
      <StationList
        loading={loading}
        stations={stations}
        location={location}
        getDistance={getDistance}
        getAvatarColor={getAvatarColor}
        onRefresh={() => {
          setLoading(true);
          MapboxGL.locationManager.getLastKnownLocation().then((loc) => {
            if (loc?.coords) {
              const { longitude, latitude } = loc.coords;
              const newCoords = [longitude, latitude];
              setLocation(newCoords);
              fetchStationsWithPrices(newCoords);
            } else {
              Alert.alert("Error", "Location not available. Try again.");
              setLoading(false);
            }
          });
        }}
      />
    </View>
  );
};

export default NearbyStation;
