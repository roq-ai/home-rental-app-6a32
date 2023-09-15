import { Box, Flex, Spinner, Grid, GridItem } from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import AppLayout from "layout/app-layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { compose } from "lib/compose";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useSession,
  withAuthorization,
} from "@roq/nextjs";

import { getPropertyById } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { DetailContainer } from "components/detail-view/DetailContainer";
import LocationMap from "components/mapbox/LocationMap";

function PropertyViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { session } = useSession();
  const currentUser = session?.user?.roles?.[0];
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

  if (!data) {
    return <></>;
  }

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: "Properties",
              link: currentUser === "host" ? "/my-properties" : "/properties",
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
        <Grid>
          <GridItem>
            <DetailContainer data={data} />
          </GridItem>
          <GridItem>
            <Box
              borderWidth="2px"
              minH="480px"
              rounded="xl"
              borderStyle="dashed"
            >
              <LocationMap
                latitude={data?.latitude}
                longitude={data?.longitude}
              />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: "/",
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: "property",
    operation: AccessOperationEnum.READ,
  })
)(PropertyViewPage);
