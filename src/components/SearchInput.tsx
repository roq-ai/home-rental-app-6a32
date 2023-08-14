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
import { SyntheticEvent, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import DatePicker from "./date-picker";
import { Calendar, DateRangePicker } from "react-date-range";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import useSWR from "swr";
import { getProperties } from "apiSdk/properties";
import { useFilter } from "context/FilterContext";
const LocationList = ({ locations, inputWidth, onLocationSelect }: any) => {
  const { data, error, isLoading, mutate } = useSWR(
    () => "/properties",
    () => getProperties()
  );
  const uniqueLocations = Array.from(new Set(locations)) as string[];
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
      {uniqueLocations.map((location: string, index: any) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          py="2"
          cursor="pointer"
          _hover={{ bg: "gray.100", borderRadius: "md", p: "1" }}
          onClick={() => onLocationSelect(location)}
        >
          <Icon as={FaMapMarkerAlt} color="#FD5B61" mr="2" />
          {location}
        </Box>
      ))}
    </Box>
  );
};

export const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(null);
  const { filteredValue, setFilteredValue } = useFilter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };
  const handlePickDateClick = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };
  const handleInputClick = () => {
    setShowDatePicker(true);
    setShowLocationList(true);
    setExpanded(true);
  };
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationList(false);
    setSearchInput(location);
    setFilteredValue(location);
  };
  const handleCollpaseSearch = () => {
    setExpanded(false);
  };

  const handleCheckInClick = () => {
    // Handle Check In button click
  };

  const handleCheckOutClick = () => {
    // Handle Check Out button click
  };

  const handleWhoOutClick = () => {
    // Handle Who dropdown select
  };

  const { data, error, isLoading, mutate } = useSWR(
    () => "/properties",
    () => getProperties()
  );

  const properties = data?.data || []; // Extracting properties from data

  // ... (other parts of the component)

  const filteredLocations = properties
    .map((property: any) => property.location) // Extracting locations from properties
    .filter((location: string) =>
      location.toLowerCase().includes(searchInput.toLowerCase())
    );

  // Join the filtered locations array into a single string
  const joinedFilteredLocations = filteredLocations.join(", "); // You can adjust the separator as needed
  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
    setShowLocationList(true);
    setExpanded(true);

    // Join the filtered locations array into a single string
    const joinedFilteredLocations = filteredLocations.join(", "); // You can adjust the separator as needed
    setFilteredValue(joinedFilteredLocations);
  };
  // console.log({ filteredLocations });
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
              // onInput={handleInputChange}
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
                onChange={handleInputChange} // Use onChange instead of onClick
                value={searchInput}
                focusBorderColor="#FD5B61"
                borderRadius={"20rem"}
                border="1px solid lightgray"
                width="20rem"
                fontSize="md"
                variant="filled"
                type="text"
                background="whitesmoke"
                placeholder="What are you looking for?"
                autoComplete="off"
                _focus={{
                  background: "white",
                }}
              />
            </InputGroup>
            <Button
              // onClick={handleCheckInClick}
              size="sm"
              px={5}
              variant="unstyled"
              fontSize="xs"
              onClick={handlePickDateClick}
            >
              Check In
              <Text fontSize="xs" fontWeight="normal">
                Add Dates
              </Text>
            </Button>
            <Button
              // onClick={handleCheckOutClick}
              size="sm"
              px={5}
              ml={5}
              variant="unstyled"
              fontSize="xs"
              onClick={handlePickDateClick}
            >
              Check Out
              <Text fontSize="xs" fontWeight="normal">
                Add Dates
              </Text>
              {/* <Calendar onChange={(item) => setDate(item)} date={new Date()} /> */}
            </Button>
            <Button
              onClick={handleWhoOutClick}
              size="sm"
              px={5}
              ml={5}
              variant="unstyled"
              fontSize="xs"
            >
              Who
              <Text fontSize="xs" fontWeight="normal">
                Add Guest
              </Text>
            </Button>
            {isDatePickerVisible && (
              <Box
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
                  editableDateInputs={true}
                  ranges={[selectionRange]}
                  minDate={new Date()}
                  onChange={handleSelect}
                  rangeColors={["#FD5B61"]}
                />
              </Box>
            )}
            <Button
              colorScheme="pink"
              variant="solid"
              marginLeft="3rem"
              borderRadius={"20rem"}
              onClick={handleCollpaseSearch}
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
