import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from "@roq/nextjs";
import { compose } from "lib/compose";
import { Box, Flex, SimpleGrid, Text, TextProps } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

import { Error } from "components/error";
import { SearchInput } from "components/search-input";
import {
  useDataTableParams,
  ListDataFiltersType,
} from "components/table/hook/use-data-table-params.hook";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { PaginatedInterface } from "interfaces";
import { withAppLayout } from "lib/hocs/with-app-layout.hoc";
import { getBookings } from "apiSdk/bookings";
import { BookingInterface } from "interfaces/booking";
import BookingCard from "components/booking-section/BookingCard";

interface BookingListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function BookingListPage(props: BookingListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = false,
    hidePagination,
    hideTableBorders,
    pageSize,
    tableOnly,
    hideActions,
  } = props;
  const { hasAccess } = useAuthorizationApi();
  const {
    onSearchTermChange,
    params,
    onPageChange,
    onPageSizeChange,
    setParams,
  } = useDataTableParams({
    filters,
    searchTerm: "",
    pageSize,
    order: [
      {
        desc: true,
        id: "created_at",
      },
    ],
  });

  const fetcher = useCallback(
    async () =>
      getBookings({
        relations: ["user", "property"],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: [],
        ...(params.filters || {}),
      }),
    [
      params.pageSize,
      params.pageNumber,
      params.searchTerm,
      params.order,
      params.filters,
    ]
  );

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedInterface<BookingInterface>
  >(() => `/bookings?params=${JSON.stringify(params)}`, fetcher);

  const [deleteError, setDeleteError] = useState(null);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" w="100%" h="100%">
        <Spinner size="lg" color="black" />
      </Flex>
    );
  }
  return (
    <Box p={4} rounded="md" shadow="none">
      <Flex justifyContent="space-between" mb={4}>
        <Flex alignItems="center" gap={1}>
          <Text
            as="h1"
            fontSize="1.875rem"
            fontWeight="bold"
            color="base.content"
            {...titleProps}
          >
            Bookings
          </Text>
        </Flex>
      </Flex>
      {showSearchFilter && (
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "flex-start", md: "space-between" }}
          mb={4}
          gap={{ base: 2, md: 0 }}
        >
          <Box></Box>
          <Box>
            <SearchInput
              value={params.searchTerm}
              onChange={onSearchTermChange}
            />
          </Box>
        </Flex>
      )}

      {error && (
        <Box mb={4}>
          <Error error={error} />
        </Box>
      )}
      {deleteError && (
        <Box mb={4}>
          <Error error={deleteError} />{" "}
        </Box>
      )}
      <SimpleGrid
        display="flex"
        flexWrap="wrap"
        columns={3}
        columnGap="3"
        rowGap="6"
      >
        {data?.data?.length === 0 ? (
          <Text color="gray.500" textAlign="center" fontSize="lg" mt="8">
            No bookings available yet.
          </Text>
        ) : (
          data?.data?.map((item) => <BookingCard key={item.id} data={item} />)
        )}
      </SimpleGrid>
    </Box>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: "/",
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: "booking",
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout()
)(BookingListPage);
