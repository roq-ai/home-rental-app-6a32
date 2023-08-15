import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

const LocationMap = ({ latitude, longitude }) => {
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
    <div ref={mapContainerRef} style={{ width: "500px", height: "600px" }} />
  );
};

export default LocationMap;
