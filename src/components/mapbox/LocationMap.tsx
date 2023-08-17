import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Box } from "@chakra-ui/react";

const LocationMap = ({ latitude, longitude, width = "950" }: any) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN; // Replace with your Mapbox access token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 12.5,
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <Box
      minW={{base:'200px', md:'300px', lg:'550px'}}
      ref={mapContainerRef}
      style={{ height: "100%" }}
    />
  );
};

export default LocationMap;
