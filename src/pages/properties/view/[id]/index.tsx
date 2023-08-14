import {
  Box,
  Center,
  Flex,
  Link,
  List,
  ListItem,
  Spinner,
  Stack,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import { Error } from "components/error";
import { FormListItem } from "components/form-list-item";
import { FormWrapper } from "components/form-wrapper";
import AppLayout from "layout/app-layout";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { routes } from "routes";
import useSWR from "swr";
import { compose } from "lib/compose";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from "@roq/nextjs";
import { UserPageTable } from "components/user-page-table";
import { EntityImage } from "components/entity-image";
import { FiEdit2 } from "react-icons/fi";

import { getPropertyById } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { BookingListPage } from "pages/bookings";
import { DetailContainer } from "components/detail-view/DetailContainer";
import { products } from "components/detail-view/_data";

function PropertyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PropertyInterface>(
    () => (id ? `/properties/${id}` : null),
    () => getPropertyById(id)
  );
  if (isLoading) return null;
  console.log({ id });
  console.log({ data });
  // const [deleteError, setDeleteError] = useState(null);
  // const [createError, setCreateError] = useState(null);

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
        <Box px="350">Map</Box>
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
