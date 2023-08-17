import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
  useSession,
} from "@roq/nextjs";
import { compose } from "lib/compose";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Link,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "components/table";
import {
  useDataTableParams,
  ListDataFiltersType,
} from "components/table/hook/use-data-table-params.hook";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash } from "react-icons/fi";
import useSWR from "swr";
import { PaginatedInterface } from "interfaces";
import { withAppLayout } from "lib/hocs/with-app-layout.hoc";
import {
  getProperties,
  deletePropertyById,
  getPropertyById,
  searchProperties,
} from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { PropertyGrid } from "components/property-list/PropertyGrid";
import PropertyCard from "components/property-list/PropertyList";
import { useFilter } from "context/FilterContext";
import { BiMapPin } from "react-icons/bi";
import ListMap from "components/mapbox/ListMap";
import { getCompanyById } from "apiSdk/companies";

type ColumnType = ColumnDef<PropertyInterface, unknown>;

interface PropertyListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function PropertyListPage(props: PropertyListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = true,
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
      getProperties({
        relations: ["company", "booking.count"],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: [
          "name.contains",
          "description.contains",
          "location.contains",
        ],

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
  const { session } = useSession();
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedInterface<PropertyInterface>
  >(() => `/properties?params=${JSON.stringify(params)}`, fetcher);

  const currentUser = session.user.roles?.[0];
  const [showMap, setShowMap] = useState(false);
  // const [searchResult, setSearchResult] = useState([]);
  const {
    filteredValue,
    selectedAmenities,
    selectedBeds,
    selectedBaths,
    selectedPropertyType,
    minValue,
    maxValue,
    FilterNumber,
    setFilterNumber,
    searchResult,
  } = useFilter();
  const filterIsEmpty =
    !filteredValue &&
    selectedAmenities.length === 0 &&
    !selectedBeds &&
    !selectedBaths &&
    !selectedPropertyType &&
    !minValue &&
    !maxValue;

  useEffect(() => {
    if (filterIsEmpty) {
      mutate(); // Trigger refetch when all filters are empty
    }
  }, [filterIsEmpty, mutate]);

  const filterMatches = (item: PropertyInterface) => {
    // Filter based on amenities
    if (
      selectedAmenities.length > 0 &&
      (!item.amenities || item.amenities.length === 0)
    ) {
      return false;
    }

    const amenitiesMatch =
      selectedAmenities.length === 0 ||
      (item.amenities &&
        item.amenities.some((amenity) => selectedAmenities.includes(amenity)));

    // Filter based on beds
    const bedsMatch = !selectedBeds || item.num_of_beds === selectedBeds;

    // Filter based on baths
    const bathsMatch = !selectedBaths || item.num_of_baths === selectedBaths;

    // Filter based on property type
    const propertyTypeMatch =
      !selectedPropertyType || item.type === selectedPropertyType;

    // Filter based on price
    const priceMatch =
      (Number(minValue) === 0 || item.price >= minValue) &&
      (Number(maxValue) === 4000 || item.price <= maxValue);
    // Combine all filter criteria
    return (
      amenitiesMatch &&
      bedsMatch &&
      bathsMatch &&
      propertyTypeMatch &&
      priceMatch
    );
  };

  const filteredData =
    selectedAmenities.length > 0 ||
    selectedBeds ||
    selectedBaths ||
    selectedPropertyType ||
    minValue ||
    maxValue
      ? data?.data.filter(filterMatches)
      : data?.data;
  useEffect(() => {
    setFilterNumber(filteredData?.length as unknown as string);
  }, [filteredData, setFilterNumber]);

  console.log("filtered data",{ filteredData });
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);
  useEffect(() => {
    setFilterNumber(filteredData?.length as unknown as string);
  }, [filteredData, setFilterNumber]);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePropertyById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };
  const [input, setInput] = useState("");
  const searchInput = data?.data?.filter((item) =>
    filteredValue ? item.location.includes(filteredValue) : true
  );
  const handleView = (row: PropertyInterface) => {
    if (
      hasAccess("property", AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
    ) {
      router.push(`/properties/view/${row.id}`);
    }
  };

  return (
    <Box
      maxW="7xl"
      mx="auto"
      px={{ base: "4", md: "6", lg: "6" }}
      py={{ base: "6", md: "6", lg: "6" }}
    >
      <Flex alignItems="center" gap={1}>
        {/* <Input
          placeholder="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={() => mutate(searchFromBE(input))}>Search</Button> */}
        <Text
          as="h1"
          fontSize="1.875rem"
          fontWeight="bold"
          color="base.content"
          pb={{ base: "2", md: "2", lg: "2" }}
          {...titleProps}
        >
          Properties
        </Text>
      </Flex>
      {hasAccess(
        "property",
        AccessOperationEnum.CREATE,
        AccessServiceEnum.PROJECT
      ) && (
        <NextLink href={`/properties/create`} passHref legacyBehavior>
          <Button
            onClick={(e) => e.stopPropagation()}
            height={"2rem"}
            padding="0rem 0.75rem"
            fontSize={"0.875rem"}
            fontWeight={600}
            bg="#ff385c"
            borderRadius={"6px"}
            color="base.100"
            _hover={{
              bg: "state.info.focus",
            }}
            mr="4"
            as="a"
            mb={5}
          >
            <FiPlus
              size={16}
              color="state.info.content"
              style={{ marginRight: "0.25rem" }}
            />
            Create
          </Button>
        </NextLink>
      )}
      {/* <PropertyGrid>
        {properties.map((property) => (
          <NextLink href={`/properties/view/${property.id}`} key={property.id}>
            <PropertyCard property={property} />
          </NextLink>
        ))}
      </PropertyGrid> */}
      <Flex direction="row" gap={2}>
        {!showMap && (
          <Flex
            flex={showMap ? 1 : "auto"} // Use flex 1 when map is shown, otherwise use auto
            flexBasis={0} // Set the flex basis to 0 to allow the flex property to take effect
          >
            {filteredData?.length === 0 ? (
              <Text color="gray.500" textAlign="center" fontSize="lg" mt="8">
                No properties found.
              </Text>
            ) : searchResult.length !== 0 ? (
              <PropertyGrid>
                {searchResult?.map((item) => (
                  <PropertyCard data={item} key={item.id} />
                ))}
              </PropertyGrid>
            ) : (
              <PropertyGrid>
                {filteredData?.map((item) => (
                  <PropertyCard data={item} key={item.id} />
                ))}
              </PropertyGrid>
            )}
          </Flex>
        )}
      </Flex>
      {showMap && (
        <Box flex={1} flexBasis={0} height={500}>
          <ListMap locations={filteredData} />
        </Box>
      )}
      {currentUser === "guest" && (
        <Flex direction="column" align="center" mt={4}>
          <Box
            position="fixed"
            bottom="1rem"
            left="50%"
            transform="translateX(-50%)"
          >
            <Button
              leftIcon={<BiMapPin />}
              onClick={() => setShowMap(!showMap)}
              zIndex={900002}
              fontSize="1rem"
              fontWeight="bold"
              background="black"
              color="white"
              backgroundColor="black"
              borderRadius="3xl"
              _hover={{
                backgroundColor: "black",
              }}
              _active={{
                backgroundColor: "black",
              }}
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </Box>
        </Flex>
      )}
    </Box>
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
  }),
  withAppLayout()
)(PropertyListPage);
