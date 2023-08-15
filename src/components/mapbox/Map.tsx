import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const Map = ({ onLocationSelect }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVzaGlyMTIiLCJhIjoiY2xsYzJ6azQ4MGJ0djNtdGNzOWIwbXprMSJ9.xPKYX8ncIi2FYBvPdVoFgA";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 1,
    });

    map.on("load", () => {
      map.resize(); // Resize the map to fit the container
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true, // Enable marker
    });

    map.addControl(geocoder, "top-right");

    geocoder.on("result", function (e) {
      const longitude = e.result.geometry.coordinates[0];
      const latitude = e.result.geometry.coordinates[1];
      const name = e.result.place_name;

      onLocationSelect({ name, longitude, latitude });

      map.flyTo({
        // Move the map to the selected location
        center: e.result.geometry.coordinates,
        essential: true,
        zoom: 10, // Zoom in on the selected location
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default Map;
