import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";
import { getCenter } from "geolib";
const ListMap = ({ locations }: any) => {
  const mapContainerRef = useRef(null);

  const coordinates = locations.map((location: any) => ({
    longitude: location.longitude,
    latitude: location.latitude,
  }));
  const mapCenter = getCenter(coordinates);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [mapCenter?.latitude, mapCenter?.longitude],
      zoom: 1,
    });

    locations.map((location: any) =>
      new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map)
    );

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  });

  return (
    <Box ref={mapContainerRef} style={{ width: "auto", height: "500px" }} />
  );
};

export default ListMap;
