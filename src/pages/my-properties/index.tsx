import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from "@roq/nextjs";
import { compose } from "lib/compose";
import { Box, Button, Flex, Spinner, Text, TextProps } from "@chakra-ui/react";
import {
  useDataTableParams,
  ListDataFiltersType,
} from "components/table/hook/use-data-table-params.hook";
import NextLink from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import useSWR from "swr";
import { withAppLayout } from "lib/hocs/with-app-layout.hoc";
import { getProperties } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { PropertyGrid } from "components/property-list/PropertyGrid";
import PropertyCard from "components/property-list/PropertyList";
import { useFilter } from "context/FilterContext";
import ListMap from "components/mapbox/ListMap";

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
  const { data, error, isLoading, mutate } = useSWR(
    () => `/properties?params=${JSON.stringify(params)}`,
    fetcher
  );
  console.log(data,"all datas")
  const [showMap, setShowMap] = useState(false);
  const {
    filteredValue,
    selectedAmenities,
    selectedBeds,
    selectedBaths,
    selectedPropertyType,
    minValue,
    maxValue,
    setFilterNumber,
    searchResult,
    isSearched,
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
      mutate();
    }
  }, [filterIsEmpty, mutate]);

  const filterMatches = (item: PropertyInterface) => {
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

  const filteredData: any =
    selectedAmenities.length > 0 ||
    selectedBeds ||
    selectedBaths ||
    selectedPropertyType ||
    minValue ||
    maxValue
      ? data?.filter(filterMatches)
      : data;
  useEffect(() => {
    setFilterNumber(filteredData?.length);
  }, [filteredData, setFilterNumber]);

  useEffect(() => {
    setFilterNumber(filteredData?.length);
  }, [filteredData, setFilterNumber]);

  return (
    <Box
      maxW="7xl"
      mx="auto"
      px={{ base: "4", md: "6", lg: "6" }}
      py={{ base: "6", md: "6", lg: "6" }}
    >
      <Flex alignItems="center" gap={1}>
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
            bg="primary.main"
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
      {data == undefined ? (
        <Flex align="center" justify="center" w="100%" h="60vh">
          <Spinner size="lg" color="black" />
        </Flex>
      ) : (
        <Flex direction="row" gap={2}>
          {!showMap && (
            <Flex flex={showMap ? 1 : "auto"} flexBasis={0}>
              {filteredData?.length !== 0 && !isSearched ? (
                <PropertyGrid
                  medium={showMap ? 3 : 3}
                  large={showMap ? 2 : 4}
                  extra={showMap ? 2 : 4}
                  small={2}
                >
                  {filteredData?.map((item: any) => (
                    <PropertyCard data={item} key={item.id} />
                  ))}
                </PropertyGrid>
              ) : searchResult.length !== 0 ? (
                <PropertyGrid
                  medium={showMap ? 3 : 3}
                  large={showMap ? 2 : 4}
                  extra={showMap ? 2 : 4}
                  small={2}
                >
                  {searchResult?.map((item) => {
                    return <PropertyCard data={item} key={item.id} />;
                  })}
                </PropertyGrid>
              ) : (
                <Text color="gray.500" textAlign="center" fontSize="lg" mt="8">
                  No properties found.
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      )}
      {showMap && (
        <Box flex={1} flexBasis={0} height={500}>
          <ListMap locations={filteredData} />
        </Box>
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
