import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box, Stack, Text } from "@chakra-ui/react";
import { getCenter } from "geolib";
import { PropertyInterface } from "interfaces/property";
import { renderToStaticMarkup } from "react-dom/server";
import { PriceTag } from "components/property-list/PriceTag";
import Image from "next/image";
import { useFilter } from "context/FilterContext";

const PopupContent = ({ data }: any) => {
  return (
    <Box
      style={{ padding: "6px", backgroundColor: "#fff", borderRadius: "8px" }}
    >
      <Stack direction={"column"} fontSize={"sm"}>
        <Image
          src={data.image_urls?.[0]}
          alt={data.name}
          width={200}
          height={200}
        />
        <Box mt={1}>
          <Text fontSize="md" fontWeight="medium" color="gray.900">
            {data.location.split(",")}
          </Text>

          <Text fontSize="sm" fontWeight="normal" color="gray.400">
            {data.name}
          </Text>
          <PriceTag currency="USD" price={data.price} />
        </Box>
      </Stack>
    </Box>
  );
};

const ListMap = ({ locations }: any) => {
  const { searchedLat, searchedLong } = useFilter();
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  // console.log("from", { searchedLat, searchedLong });
  const coordinates = locations?.map((location: PropertyInterface) => ({
    longitude: location.longitude,
    latitude: location.latitude,
  }));
  const mapCenter: any = getCenter(coordinates);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        searchedLong ? searchedLong : mapCenter?.longitude,
        searchedLat ? searchedLat : mapCenter?.latitude,
      ],
      zoom: searchedLat ? 6 : 1,
    });

    locations.forEach((location: any) => {
      const popupContent = renderToStaticMarkup(
        <PopupContent data={location} />
      );

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current)
        .setPopup(popup);

      marker.getElement()?.addEventListener("mouseenter", () => {
        popup.addTo(map.current);
      });

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
  }, [
    locations,
    mapCenter.latitude,
    mapCenter.longitude,
    searchedLat,
    searchedLong,
  ]);

  return (
    <Box
      ref={mapContainerRef}
      style={{ width: "auto", height: "80vh", overflow: "hidden" }}
    />
  );
};

export default ListMap;

