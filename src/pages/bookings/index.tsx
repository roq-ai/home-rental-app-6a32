import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from "@roq/nextjs";
import { compose } from "lib/compose";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

import { ColumnDef } from "@tanstack/react-table";
import { Error } from "components/error";
import { SearchInput } from "components/search-input";
import Table from "components/table";
import {
  useDataTableParams,
  ListDataFiltersType,
} from "components/table/hook/use-data-table-params.hook";
import { DATE_TIME_FORMAT } from "const";
import d from "dayjs";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import AppLayout from "layout/app-layout";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { FiEdit2, FiPlus, FiTrash } from "react-icons/fi";
import useSWR from "swr";
import { PaginatedInterface } from "interfaces";
import { withAppLayout } from "lib/hocs/with-app-layout.hoc";
import { AccessInfo } from "components/access-info";
import { getBookings, deleteBookingById } from "apiSdk/bookings";
import { BookingInterface } from "interfaces/booking";
import BookingCard from "components/BookingCard";
import { PropertyGrid } from "components/property-list/PropertyGrid";
import { BookingGrid } from "components/BookingGrid";

type ColumnType = ColumnDef<BookingInterface, unknown>;

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
    onFiltersChange,
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

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);
  console.log({ data });

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteBookingById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: BookingInterface) => {
    if (
      hasAccess("booking", AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
    ) {
      router.push(`/bookings/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    {
      id: "start_date",
      header: "Start Date",
      accessorKey: "start_date",
      cell: ({ row: { original: record } }: any) =>
        record?.start_date
          ? format(
              parseISO(record?.start_date as unknown as string),
              "dd-MM-yyyy"
            )
          : "",
    },
    {
      id: "end_date",
      header: "End Date",
      accessorKey: "end_date",
      cell: ({ row: { original: record } }: any) =>
        record?.end_date
          ? format(
              parseISO(record?.end_date as unknown as string),
              "dd-MM-yyyy"
            )
          : "",
    },
    hasAccess("user", AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: "user",
          header: "User",
          accessorKey: "user",
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/users/view/${record.user?.id}`}
            >
              {record.user?.email}
            </Link>
          ),
        }
      : null,
    hasAccess("property", AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: "property",
          header: "Property",
          accessorKey: "property",
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/properties/view/${record.property?.id}`}
            >
              {record.property?.name}
            </Link>
          ),
        }
      : null,
    !hideActions
      ? {
          id: "actions",
          header: "",
          accessorKey: "actions",
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink
                href={`/bookings/view/${record.id}`}
                passHref
                legacyBehavior
              >
                <Button
                  onClick={(e) => e.stopPropagation()}
                  mr={2}
                  padding="0rem 8px"
                  height="24px"
                  fontSize="0.75rem"
                  variant="solid"
                  backgroundColor="state.neutral.transparent"
                  color="state.neutral.main"
                  borderRadius="6px"
                >
                  View
                </Button>
              </NextLink>
              {hasAccess(
                "booking",
                AccessOperationEnum.UPDATE,
                AccessServiceEnum.PROJECT
              ) && (
                <NextLink
                  href={`/bookings/edit/${record.id}`}
                  passHref
                  legacyBehavior
                >
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    mr={2}
                    padding="0rem 0.5rem"
                    height="24px"
                    fontSize="0.75rem"
                    variant="outline"
                    color="state.info.main"
                    borderRadius="6px"
                    border="1px"
                    borderColor="state.info.transparent"
                    leftIcon={
                      <FiEdit2
                        width="12px"
                        height="12px"
                        color="state.info.main"
                      />
                    }
                  >
                    Edit
                  </Button>
                </NextLink>
              )}
              {hasAccess(
                "booking",
                AccessOperationEnum.DELETE,
                AccessServiceEnum.PROJECT
              ) && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  padding="0rem 0.5rem"
                  variant="outline"
                  aria-label="edit"
                  height={"24px"}
                  fontSize="0.75rem"
                  color="state.error.main"
                  borderRadius="6px"
                  borderColor="state.error.transparent"
                  icon={
                    <FiTrash width="12px" height="12px" color="error.main" />
                  }
                />
              )}
            </Flex>
          ),
        }
      : null,
  ].filter(Boolean) as ColumnType[];
  const table = (
    <Table
      hidePagination={hidePagination}
      hideTableBorders={hideTableBorders}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      columns={columns}
      data={data?.data}
      totalCount={data?.totalCount || 0}
      pageSize={params.pageSize}
      pageIndex={params.pageNumber}
      order={params.order}
      setParams={setParams}
      onRowClick={handleView}
    />
  );
  if (tableOnly) {
    return table;
  }
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
          data?.data?.map((item) => (
            <NextLink href={`/bookings/view/${item.id}`} key={item.id}>
              <BookingCard data={item} />
            </NextLink>
          ))
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
