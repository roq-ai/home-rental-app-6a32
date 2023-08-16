import { Box } from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import AppLayout from "layout/app-layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { compose } from "lib/compose";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from "@roq/nextjs";

import { getPropertyById } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { DetailContainer } from "components/detail-view/DetailContainer";
import LocationMap from "components/mapbox/LocationMap";

function PropertyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PropertyInterface>(
    () => (id ? `/properties/${id}` : null),
    () => getPropertyById(id)
  );
  if (isLoading) return null;

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: "Properties",
              link: "/properties",
            },
            {
              label: "Property Details",
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <DetailContainer data={data} />
      <Box borderWidth="2px" minH="480px" rounded="xl" borderStyle="dashed">
        <LocationMap latitude={data.latitude} longitude={data.longitude} />
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
