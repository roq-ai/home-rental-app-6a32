import { Box, Flex, Spinner } from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import AppLayout from "layout/app-layout";
import { useRouter } from "next/router";
import useSWR from "swr";

import { getPropertyById } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { DetailContainer } from "components/detail-view/DetailContainer";
import LocationMap from "components/mapbox/LocationMap";

function PropertyViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PropertyInterface>(
    () => (id ? `/properties/${id}` : null),
    () => getPropertyById(id)
  );
  if (isLoading) {
    return (
      <Flex align="center" justify="center" w="100%" h="100%">
        <Spinner size="lg" color="black" />
      </Flex>
    );
  }

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: "Properties",
              link: "/",
            },
            {
              label: "Property Details",
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box maxW={"6xl"}>
        <DetailContainer data={data} />
        <Box borderWidth="2px" minH="480px" rounded="xl" borderStyle="dashed">
          <LocationMap latitude={data?.latitude} longitude={data?.longitude} />
        </Box>
      </Box>
    </AppLayout>
  );
}

export default PropertyViewPage;
