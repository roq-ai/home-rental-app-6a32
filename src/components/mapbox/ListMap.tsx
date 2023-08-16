import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";

const ListMap = ({ locations }: any) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [locations[0]?.longitude, locations[0]?.latitude],
      zoom: 12.5,
    });

    mapRef.current = map;

    const markers = locations.map((location: any) => {
      const marker = new mapboxgl.Marker().setLngLat([
        location.longitude,
        location.latitude,
      ]);

      marker.addTo(map);

      return marker;
    });

    markersRef.current = markers;

    return () => {
      markers.forEach((marker: { remove: () => any }) => marker.remove());
      map.remove();
    };
  }, [locations]);

  return (
    <Box
      ref={mapContainerRef}
      style={{ width: "auto", height: "500px", overflow: "hidden" }}
    />
  );
};

export default ListMap;
