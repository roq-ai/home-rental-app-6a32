import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Box } from "@chakra-ui/react";

const LocationMap = ({ latitude, longitude }: any) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 12.5,
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => map.remove();
  });

  return (
    <>
      <Box
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px", overflow: "hidden" }}
      />
    </>
  );
};

export default LocationMap;
