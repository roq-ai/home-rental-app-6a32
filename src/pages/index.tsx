import { useSession } from "@roq/nextjs";
import { Button, Grid, Spinner } from "@chakra-ui/react";
import { Box, Flex, Text, TextProps } from "@chakra-ui/react";
import {
  useDataTableParams,
  ListDataFiltersType,
} from "components/table/hook/use-data-table-params.hook";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getHomeProperties } from "apiSdk/properties";
import { PropertyInterface } from "interfaces/property";
import { useFilter } from "context/FilterContext";
import { useRouter } from "next/router";
import ListMap from "components/mapbox/ListMap";
import { PropertyGrid } from "components/property-list/PropertyGrid";
import PropertyCard from "components/property-list/PropertyList";
import { BiMapPin } from "react-icons/bi";
import React from "react";
import AppLayout from "layout/app-layout";

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

    pageSize,
  } = props;
  const { params } = useDataTableParams({
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
  function Loader() {
    return (
      <Flex align="center" justify="center" w="100%" h="60vh">
        <Spinner size="lg" color="black" />
      </Flex>
    );
  }
  // const fetcher = useCallback(async () => getHomeProperties(), []);
  const { data, error, isLoading, mutate } = useSWR(
    () => `/properties?params=${JSON.stringify(params)}`,
    () => getHomeProperties()
  );

  const [showMap, setShowMap] = useState(true);
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
    longitude,
    latitude,
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
      ? data?.filter(filterMatches)
      : data;

  useEffect(() => {
    setFilterNumber(filteredData?.length as unknown as string);
  }, [filteredData, setFilterNumber]);
  let currentUser: any;

  const { session, status } = useSession();
  currentUser = session?.user?.roles?.[0];
  const router = useRouter();

  useEffect(() => {
    if (currentUser === "host") {
      router.push("/my-properties");
    } else if (currentUser === "guest") {
      router.push("/properties");
    }
  }, [currentUser, router]);

  return (
    <AppLayout>
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
        </Flex>
        {status === "unauthenticated" ? (
          <Grid
            templateColumns={{ lg: showMap ? "1fr 1fr" : "1fr", md: "1fr" }}
            gap={4}
          >
            <Box
              height="auto"
              overflowY={showMap ? "auto" : "hidden"}
              css={{
                maxHeight: "100vh",
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#333 #333",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#333",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f0e6f6",
                },
                overflowX: "hidden",
              }}
            >
              {
                <Box>
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
                      <Text
                        color="gray.500"
                        textAlign="center"
                        fontSize="lg"
                        mt="8"
                      >
                        No properties found.
                      </Text>
                    )}
                  </Flex>
                </Box>
              }
            </Box>

            {data && showMap && (
              <Box
                flex={1}
                flexBasis={0}
                height={500}
                rounded="md"
                display={{
                  lg: "block",
                  extra: "block",
                  md: "none",
                  sm: "none",
                  base: "none",
                }}
              >
                {filteredData?.length !== 0 &&
                searchResult.length === 0 &&
                !isSearched ? (
                  <ListMap locations={filteredData} />
                ) : (
                  <ListMap
                    locations={searchResult}
                    // searchedLat={latitude}
                    // searchedLong={longitude}
                  />
                )}
              </Box>
            )}
          </Grid>
        ) : null}

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
    </AppLayout>
  );
}
export default React.memo(PropertyListPage);
