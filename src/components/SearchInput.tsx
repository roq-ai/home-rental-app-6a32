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
import { FiSearch } from "react-icons/fi";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useSWR from "swr";
import { getProperties, searchProperties } from "apiSdk/properties";
import { useFilter } from "context/FilterContext";
import { useDataTableParams } from "./table/hook/use-data-table-params.hook";
import { PropertyGetQueryInterface } from "interfaces/property";
import { QuantityPicker } from "./detail-view/QuantityPicker";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import dynamic from "next/dynamic";

const DynamicSearchBox = dynamic(() => import("./mapbox/SearchBox"), {
  ssr: false,
}) as any;

export const SearchInput = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const {
    setSearchResult,
    setGuest,
    guest,
    latitude,
    longitude,
    isSearched,
    isSetSearched,
  } = useFilter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isWhoVisible, setWhoVisible] = useState(false);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  function formatDate(date: any) {
    const year = date?.getFullYear() ?? new Date().getFullYear();
    const month = date?.getMonth() + 1 ?? new Date().getMonth() + 1;
    const day = date?.getDate() ?? new Date().getDate();

    // Format the date as "YYYY-MM-DD"
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }
  const searchFromBE = async (query: PropertyGetQueryInterface) => {
    isSetSearched(true);
    let startDateFormatted;
    let endDateFormatted;
    if (
      startDate == null ||
      startDate == undefined ||
      endDate == null ||
      endDate == undefined
    ) {
      const currentDate = new Date();
      startDateFormatted = formatDate(currentDate);
      endDateFormatted = formatDate(currentDate);
    } else {
      startDateFormatted = formatDate(startDate);
      endDateFormatted = formatDate(endDate);
    }

    try {
      const currentDate = new Date();
      const propertiesOnSearch = await searchProperties({
        latitude: query.latitude,
        longitude: query.longitude,
        start_date: startDateFormatted,
        end_date: endDateFormatted,
        num_of_guest: guest ? guest : 1,
      });

      setSearchResult(propertiesOnSearch);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };
  const datePickerRef = useRef(null);
  const quantityPickerRef = useRef(null);

  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };
  const handleInputClick = () => {
    setShowDatePicker(true);
    setExpanded(true);
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
  const { data, error, isLoading, mutate } = useSWR(
    () => `/properties?params=${JSON.stringify(params)}`,
    fetcher
  );

  const handlePickDateClick = () => {
    setDatePickerVisible(!isDatePickerVisible);
    setWhoVisible(false);
  };

  const handleWhoClick = () => {
    setWhoVisible(!isWhoVisible);
    setDatePickerVisible(false);
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
              // value={searchInput}
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
            <Box ml={3}>
              <DynamicSearchBox expanded={expanded} />
            </Box>
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
                    min={1}
                    max={5}
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
              marginLeft="1rem"
              borderRadius="full"
              _hover={{
                background: "primary.main",
                color: "white",
              }}
              onClick={() => {
                mutate(
                  searchFromBE({
                    latitude: latitude,
                    longitude: longitude,
                    // startDate: startDate,
                    // endDate: endDate,
                    // maxGuest: guest,
                  }) as any
                );
              }}
            >
              <FiSearch />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
