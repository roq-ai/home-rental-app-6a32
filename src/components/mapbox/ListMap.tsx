import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";

const ListMap = ({ locations }: any) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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

    return () => {
      markers.forEach((marker: { remove: () => any }) => marker.remove());
      map.remove();
    };
  }, [locations]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      locations.forEach((location: { longitude: number; latitude: number }) => {
        const marker = new mapboxgl.Marker().setLngLat([
          location.longitude,
          location.latitude,
        ]);

        const markerEl = marker.getElement();

        // Calculate the offset based on the marker's size
        const offsetX = -markerEl.offsetWidth / 2;
        const offsetY = -markerEl.offsetHeight / 2;

        // Project the LatLng coordinates to pixel coordinates
        const pos = map.project(marker.getLngLat());

        // Adjust the pixel coordinates based on the offset
        const adjustedPos = pos.add(new mapboxgl.Point(offsetX, offsetY));

        // Convert the adjusted pixel coordinates back to LatLng
        const adjustedLatLng = map.unproject(adjustedPos);

        marker.setLngLat(adjustedLatLng);
      });
    }
  }, [locations]);

  return (
    <Box ref={mapContainerRef} style={{ width: "auto", height: "500px" }} />
  );
};

export default ListMap;
