import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Icon, Text } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";

const containerStyle = {
  width: "500px",
  height: "400px",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const locations = [
  { lat: 77.7749, lng: -122.4194 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 40.7128, lng: -74.006 },
];

const MapWithMarkers = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={5}
      >
        {/* Default Center Marker */}
        <Marker position={defaultCenter}>
          <Icon as={FaMapMarkerAlt} boxSize={6} color="red.500" />
        </Marker>

        {/* Other Locations */}
        {locations.map((location, index) => (
          <Marker key={index} position={location}>
            <Icon as={FaMapMarkerAlt} boxSize={6} color="red.500" />
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithMarkers;
