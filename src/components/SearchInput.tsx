import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Button,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useSWR from "swr";
import { getProperties, searchProperties } from "apiSdk/properties";
import { useFilter } from "context/FilterContext";
import { useDataTableParams } from "./table/hook/use-data-table-params.hook";
import { PaginatedInterface } from "interfaces";
import { PropertyInterface } from "interfaces/property";
import { QuantityPicker } from "./detail-view/QuantityPicker";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const LocationList = ({ locations, inputWidth, onLocationSelect }: any) => {
  return (
    <Box
      p="3"
      boxShadow="2xl"
      bg="white"
      borderRadius="md"
      w={inputWidth}
      mt="2"
      overflow="hidden"
    >
      {locations.map((property: PropertyInterface, index: any) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          py="2"
          cursor="pointer"
          _hover={{ bg: "gray.100", borderRadius: "md", p: "1" }}
          onClick={() => {
            console.log("hey beshasha");
            console.log(property, "out");
            onLocationSelect(property);
          }}
        >
          <Icon as={FaMapMarkerAlt} color="#FD5B61" mr="2" />
          {property.location}
        </Box>
      ))}
    </Box>
  );
};

export const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchProperty, setSearchProperty] = useState(null);
  const [showLocationList, setShowLocationList] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { filteredValue, setFilteredValue, setSearchResult, setGuest, guest } =
    useFilter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isWhoVisible, setWhoVisible] = useState(false);
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const searchFromBE = async (query: PropertyInterface) => {
    try {
      const propertiesOnSearch = await searchProperties({
        location: query.location,
        latitude: query.latitude,
        longitude: query.longitude,
      });

      setSearchResult(propertiesOnSearch);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };
  const handleInputClick = () => {
    setShowDatePicker(true);
    setShowLocationList(true);
    setExpanded(true);
  };
  const handleLocationSelect = (property: PropertyInterface) => {
    setSelectedLocation(property.location);
    setSearchInput(property.location);
    setShowLocationList(false);
    setSearchProperty(property);
    setFilteredValue(property.location);
  };

  const { params } = useDataTableParams({
    searchTerm: "",
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
      params.filters,
      params.order,
      params.pageNumber,
      params.pageSize,
      params.searchTerm,
    ]
  );
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedInterface<PropertyInterface>
  >(() => `/properties?params=${JSON.stringify(params)}`, fetcher);

  const properties = data?.data || [];

  const filteredLocations = properties
    .map((property: any) => {
      return property;
    })
    .filter((property: any) =>
      property.location.toLowerCase().includes(searchInput.toLowerCase())
    );

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
    setShowLocationList(true);
    setExpanded(true);
    if (inputValue === "") {
      setSearchResult([]);
    }
    setFilteredValue(inputValue);
  };

  const datePickerRef = useRef(null);
  const quantityPickerRef = useRef(null);

  const handlePickDateClick = () => {
    setDatePickerVisible(!isDatePickerVisible);
    setWhoVisible(false);
  };

  const handleWhoClick = () => {
    setWhoVisible(!isWhoVisible);
    setDatePickerVisible(false); // Close DatePicker when opening QuantityPicker
  };

  const handleClickOutside = (event: any) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setDatePickerVisible(false);
    }

    if (
      quantityPickerRef.current &&
      !quantityPickerRef.current.contains(event.target)
    ) {
      setWhoVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box position="relative" pb="3">
      <Flex align="center">
        {!expanded && (
          <InputGroup>
            <InputLeftElement>
              <Icon as={RiSearchLine} color="gray.500" fontSize="lg" />
            </InputLeftElement>
            <Input
              onClick={handleInputClick}
              value={searchInput}
              focusBorderColor="#FD5B61"
              borderRadius={"20rem"}
              width="20rem"
              fontSize="md"
              variant="filled"
              type="text"
              placeholder="What are you looking for?"
              autoComplete="off"
            />
          </InputGroup>
        )}

        {expanded && (
          <Box
            display="flex"
            p="2"
            m="6"
            border="1px solid lightgray"
            bg="whitesmoke"
            borderRadius="20rem"
            width="full"
          >
            <InputGroup>
              <InputLeftElement>
                <Icon as={RiSearchLine} color="gray.500" fontSize="lg" />
              </InputLeftElement>

              <Input
                onChange={handleInputChange}
                value={searchInput}
                focusBorderColor="#FD5B61"
                borderRadius={"20rem"}
                placeholder="What are you looking for?"
              />
            </InputGroup>
            <Button
              size="sm"
              px={5}
              variant="unstyled"
              fontSize="xs"
              onClick={handlePickDateClick}
            >
              Check In
              <Text fontSize="xs" fontWeight="normal">
                {startDate ? startDate.toLocaleDateString() : "Add Date"}
              </Text>
            </Button>
            <Button
              size="sm"
              px={5}
              ml={5}
              variant="unstyled"
              fontSize="xs"
              onClick={handlePickDateClick}
            >
              Check Out
              <Text fontSize="xs" fontWeight="normal">
                {endDate ? endDate.toLocaleDateString() : "Add Date"}
              </Text>
            </Button>
            {isDatePickerVisible && (
              <Box
                ref={datePickerRef}
                position="absolute"
                top="70%"
                left="30%"
                zIndex={1}
                boxShadow="2xl"
                bg="white"
                borderRadius="lg"
              >
                <DateRangePicker
                  showMonthAndYearPickers={false}
                  // editableDateInputs={true}
                  ranges={[selectionRange]}
                  minDate={new Date()}
                  onChange={handleSelect}
                  rangeColors={["#FD5B61"]}
                />
              </Box>
            )}
            <Button
              onClick={handleWhoClick}
              size="sm"
              px={5}
              ml={5}
              variant="unstyled"
              fontSize="xs"
            >
              Who
              <Text fontSize="xs" fontWeight="normal">
                {guest ? guest : "Add Guest"}
              </Text>
            </Button>
            {isWhoVisible && (
              <>
                <Box
                  ref={quantityPickerRef}
                  position="absolute"
                  top="70%"
                  left="75%"
                  zIndex={1}
                  boxShadow="2xl"
                  bg="white"
                  borderRadius="lg"
                  border="none"
                >
                  <QuantityPicker
                    defaultValue={1}
                    max={10}
                    label="Add Guest"
                    setGuest={setGuest}
                  />
                </Box>
              </>
            )}

            <Button
              background="primary.main"
              color="white"
              variant="solid"
              marginLeft="3rem"
              borderRadius={"20rem"}
              _hover={{
                background: "primary.main",
                color: "white",
              }}
              onClick={() => mutate(searchFromBE(searchProperty) as any)}
            >
              <FiSearch size="md" />
            </Button>
          </Box>
        )}
      </Flex>
      {showLocationList && searchInput && (
        <Box position="absolute" top="58%" left={10} zIndex={1}>
          <LocationList
            locations={filteredLocations}
            inputWidth="20rem"
            onLocationSelect={handleLocationSelect}
          />
        </Box>
      )}
    </Box>
  );
};
