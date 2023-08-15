import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

const ListMap = ({ locations }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [locations[0].longitude, locations[0].latitude],
      zoom: 12.5,
    });

    locations.forEach((location) => {
      new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);
    });

    return () => map.remove();
  }, [locations]);

  return (
    <div ref={mapContainerRef} style={{ width: "200px", height: "400px" }} />
  );
};

export default ListMap;
