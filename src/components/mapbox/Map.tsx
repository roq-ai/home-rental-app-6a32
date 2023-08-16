import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {
  Box,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const Map = ({
  onLocationSelect,
  setLongitude,
  setLatitude,
  latitude,
  longitude,
}: any) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  // const [longitude, setLongitude] = useState("");
  // const [latitude, setLatitude] = useState("");

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude as any, latitude as any],
      zoom: longitude || latitude ? 5 : 1,
    });

    map.on("load", () => {
      map.resize();
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      flyTo: false,
    });

    map.addControl(geocoder, "top-right");

    geocoder.on("result", function (e) {
      const longitude = String(e.result.geometry.coordinates[0]);
      const latitude = String(e.result.geometry.coordinates[1]);
      const name = e.result.place_name;

      setLongitude(longitude);
      setLatitude(latitude);

      onLocationSelect({ name, longitude, latitude });

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({
          color: "red",
          draggable: false,
        })
          .setLngLat([
            longitude as unknown as number,
            latitude as unknown as number,
          ])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      // map.flyTo({
      //   center: e.result.geometry.coordinates,
      //   essential: true,
      //   zoom: 5,
      // });
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.remove();
    };
  }, [longitude, latitude, setLongitude, setLatitude, onLocationSelect]);

  return (
    <Box>
      <Box
        bg="blue.900"
        color="white"
        p={2}
        fontFamily="monospace"
        position="absolute"
        top={0}
        left={0}
        m={3}
        borderRadius="md"
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
        zIndex={10}
      >
        Longitude: {longitude} | Latitude: {latitude}
      </Box>
      <Box>
        <Box ref={mapContainerRef} width="100%" height="100%" />
      </Box>
    </Box>
  );
};

export default React.memo(Map);
