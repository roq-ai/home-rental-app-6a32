import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Box } from "@chakra-ui/react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;

interface MapProps {
  latitude: string;
  longitude: string;
  setLongitude: Dispatch<SetStateAction<string>>;
  setLatitude: Dispatch<SetStateAction<string>>;
  onLocationSelect: (location: {
    name: string;
    longitude: string;
    latitude: string;
  }) => void;
}
const Map = ({
  onLocationSelect,
  setLongitude,
  setLatitude,
  latitude,
  longitude,
}: MapProps) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude as unknown as number, latitude as unknown as number],
        zoom: longitude || latitude ? 6 : 1,
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      });
      mapInstance.addControl(geocoder);

      setMap(mapInstance);

      geocoder.on("result", function (e) {
        const longitude = String(e.result.geometry.coordinates[0]);
        const latitude = String(e.result.geometry.coordinates[1]);
        const name = e.result.place_name;
        setLongitude(longitude);
        setLatitude(latitude);
        onLocationSelect({ name, longitude, latitude });
      });
    };

    if (!map) {
      initializeMap();
    }
  }, [latitude, longitude, map, onLocationSelect, setLatitude, setLongitude]);

  return <Box id="map" style={{ width: "100%", height: "500px" }} />;
};

export default Map;
