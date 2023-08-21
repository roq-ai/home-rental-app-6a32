import { useSession } from "@roq/nextjs";
import { Spinner } from "@chakra-ui/react";
import { Box, Button, Flex, Text, TextProps } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useDataTableParams,
  ListDataFiltersType,
} from "components/table/hook/use-data-table-params.hook";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { PaginatedInterface } from "interfaces";
import { getProperties, deletePropertyById } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { useFilter } from "context/FilterContext";
import { BiMapPin } from "react-icons/bi";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/router";

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
let currentUser: string;
export function PropertyListPage(props: PropertyListPageProps) {
  const {
    filters = {},
    titleProps = {},

    pageSize,
  } = props;
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
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedInterface<PropertyInterface>
  >(() => `/properties?params=${JSON.stringify(params)}`, fetcher);
  console.log({ data });

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

    const bedsMatch = !selectedBeds || item.num_of_beds === selectedBeds;
    const bathsMatch = !selectedBaths || item.num_of_baths === selectedBaths;
    const propertyTypeMatch =
      !selectedPropertyType || item.type === selectedPropertyType;

    const priceMatch =
      (Number(minValue) === 0 || item.price >= minValue) &&
      (Number(maxValue) === 4000 || item.price <= maxValue);
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
  const { session, status } = useSession();
  currentUser = session?.user?.roles?.[0];
  const router = useRouter();

  // Wait for the session to load before performing redirection
  useEffect(() => {
    if (currentUser === "host") {
      router.push("/my-properties");
    } else if (currentUser === "guest") {
      router.push("/properties");
    }
  }, [currentUser, router]);
  console.log({ currentUser });
  console.log({ router });

  if (isLoading) {
    return (
      <Flex align="center" justify="center" w="100%" h="100%">
        <Spinner size="lg" color="black" />
      </Flex>
    );
  }

  return (
    <Box
      maxW="7xl"
      mx="auto"
      px={{ base: "4", md: "6", lg: "6" }}
      py={{ base: "6", md: "6", lg: "6" }}
    >
      <Flex justifyContent="space-between">
        <Text
          as="h2"
          fontSize="1.875rem"
          fontWeight="bold"
          color="base.content"
          pb={{ base: "2", md: "2", lg: "2" }}
          {...titleProps}
        >
          Properties
        </Text>
        <Link href="/login">
          <Button
            leftIcon={<FiLogIn />}
            variant="solid"
            background="primary.main"
            color="white"
            borderRadius="2xl"
            _hover={{
              background: "primary.main",
              color: "white",
            }}
          >
            Login
          </Button>
        </Link>
      </Flex>
      {/* <Grid templateColumns="2fr 1fr" gap={4}>
        <Box>
          <Flex direction="row" gap={2}>
            {
              <Flex flex={showMap ? 1 : "auto"} flexBasis={0}>
                {filteredData?.length === 0 ? (
                  <Text
                    color="gray.500"
                    textAlign="center"
                    fontSize="lg"
                    mt="8"
                  >
                    No properties found.
                  </Text>
                ) : searchResult.length !== 0 ? (
                  <PropertyGrid>
                    {searchResult?.map((item) => {
                      return <PropertyCard data={item} key={item.id} />;
                    })}
                  </PropertyGrid>
                ) : (
                  <PropertyGrid>
                    {filteredData?.map((item) => (
                      <PropertyCard data={item} key={item.id} />
                    ))}
                  </PropertyGrid>
                )}
              </Flex>
            }
          </Flex>
        </Box>

        <Box flex={1} flexBasis={0} height={500}>
          {searchResult.length !== 0 ? (
            <ListMap locations={searchResult} />
          ) : (
            <ListMap locations={filteredData} />
          )}
        </Box>
      </Grid> */}
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
    </Box>
  );
}

export default PropertyListPage;
