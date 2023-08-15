import { Box } from "@chakra-ui/react";
import ReactMapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeolocateControl, Marker } from "mapbox-gl";
const AddLocation = () => {
  return (
    <Box>
      <ReactMapGL
        accessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
        initialViewState={{ longitude: 0, latitude: 0, zoom: 8 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
      </ReactMapGL>
    </Box>
  );
};
export default AddLocation;
