import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";
import { getCenter } from "geolib";
import { PropertyInterface } from "interfaces/property";
import { renderToStaticMarkup } from "react-dom/server";
import { useFilter } from "context/FilterContext";

const PopupContent = ({
  data,
}: {
  data: { name: string; latitude: string; longitude: string };
}) => {
  return (
    <div
      style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}
    >
      <h3>{data.name}</h3>
      <p>Latitude: {data.latitude}</p>
      <p>Longitude: {data.longitude}</p>
      {/* <Image
        src={data.image_urls?.[0]}
        alt={data.name}
        width={200}
        height={200}
      /> */}
      {/* Add other relevant information */}
    </div>
  );
};
interface MapCenterProps {
  latitude: number;
  longitude: number;
}
const ListMap = ({ locations }: { locations: PropertyInterface[] }) => {
  const { latitude, longitude } = useFilter();
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const coordinates = locations?.map((location: PropertyInterface) => ({
    longitude: location.longitude,
    latitude: location.latitude,
  }));
  const mapCenter = getCenter(coordinates) as MapCenterProps;

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [Number(longitude), Number(latitude)],
      zoom: longitude ? 10 : 1,
    });

    locations?.forEach((location) => {
      const popupContent = renderToStaticMarkup(
        <PopupContent data={location} />
      );

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      }).setHTML(popupContent); // Use setHTML to set the HTML content

      const marker = new mapboxgl.Marker()
        .setLngLat([
          location.longitude as unknown as number,
          location.latitude as unknown as number,
        ])
        .addTo(map.current)
        .setPopup(popup);

      // Show popup on mouseenter
      marker.getElement()?.addEventListener("mouseenter", () => {
        popup.addTo(map.current);
      });

      // Remove popup on mouseleave
      marker.getElement()?.addEventListener("mouseleave", () => {
        popup.remove();
      });
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations, mapCenter.latitude, mapCenter.longitude]);

  return (
    <Box
      ref={mapContainerRef}
      style={{
        width: "auto",
        height: "70vh",
        // overflow: "hidden",
        position: "sticky",
      }}
    />
  );
};

export default ListMap;
