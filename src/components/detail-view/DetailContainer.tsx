import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FiClock, FiHeart } from "react-icons/fi";
import { RiRulerLine } from "react-icons/ri";
import { Gallery } from "./Gallery";
import { PriceTag } from "./PriceTag";
import { QuantityPicker } from "./QuantityPicker";
import { Product } from "./_data";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useEffect, useState } from "react";
import { Promos } from "./Promos";
import { createBooking, getBookings } from "apiSdk/bookings";
import { useRouter } from "next/router";
import { useSession } from "@roq/nextjs";
import useSWR from "swr";
import { getUsers } from "apiSdk/users";
import { UserInterface } from "interfaces/user";
import { PaginatedInterface } from "interfaces";
import { BookingInterface } from "interfaces/booking";

interface DetailContainerProps {
  product: Product;
  rootProps?: StackProps;
}
type FetchedDataType<T> = { data: T[] };

export const DetailContainer = (props: any) => {
  const { session } = useSession();
  const { data, rootProps } = props;
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useSWR<UserInterface[]>("/users", () =>
    getUsers({ roq_user_id: session.roqUserId }).then(({ data }) => data)
  );

  const {
    data: existingBookings,
    error: existingBookingsError,
    isLoading: existingBookingsLoading,
    mutate,
  } = useSWR<PaginatedInterface<BookingInterface>>(
    () => "/bookings",
    () => getBookings()
  );
  const isPropertyReserved = () => {
    if (existingBookingsError || existingBookingsLoading) {
      // Handle loading or error states
      return false;
    }

    const propertyId = data?.id;
    const bookingsForProperty = existingBookings.data.filter(
      (booking) => booking.property_id === propertyId
    );

    return bookingsForProperty.every((booking) => {
      const bookingStartDate = new Date(booking.start_date);
      const bookingEndDate = new Date(booking.end_date);
      return startDate >= bookingStartDate && startDate >= bookingEndDate;
    });
  };

  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };
  const handlePickDateClick = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };
  const calculateTotalPrice = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const numDays =
      Math.round(Math.abs((Number(endDate) - Number(startDate)) / oneDay)) + 1;
    const totalPrice = data?.price * numDays;
    return { numDays, totalPrice };
  };
  const toast = useToast();
  const { numDays, totalPrice } = calculateTotalPrice();
  const handleReserveClick = async () => {
    try {
      if (!isPropertyReserved()) {
        toast({
          title: "Property Already Reserved",
          description:
            "This property is already reserved for the selected dates.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      const bookingData = {
        start_date: startDate,
        end_date: endDate,
        guest_id: fetchedData?.[0]?.id,
        property_id: data?.id,
        num_of_guest: "",
        num_of_night: String(numDays),
        total_price: String(totalPrice),
      };

      await createBooking(bookingData);

      router.push("/bookings");
    } catch (error) {}
  };
  // const handleDocumentClick = (event: MouseEvent) => {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest("#date-picker-container")) {
  //     setDatePickerVisible(false); // Hide date picker if clicked outside
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleDocumentClick);
  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, []);

  return (
    <>
      <Stack
        direction={{ base: "column", md: "column" }}
        spacing={{ base: "8", lg: "16" }}
        {...rootProps}
      >
        <Box flex="1">
          <Gallery images={data?.image_urls} />
        </Box>
      </Stack>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: "8", lg: "16" }}
        {...rootProps}
        my={10}
      >
        <Box flex="1">
          <Promos />
        </Box>
        {session.user.roles?.[0] === "guest" ? (
          <Box flex="1" boxShadow="2xl" bg="white" borderRadius="md" p={4}>
            <Stack spacing={{ base: "4", md: "8" }}>
              <Stack spacing={{ base: "2", md: "4" }}>
                <Heading size="lg" fontWeight="medium">
                  {data?.name}
                </Heading>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing="1"
                  align="baseline"
                  justify="space-between"
                >
                  <PriceTag
                    price={data?.price}
                    currency="USD"
                    rootProps={{ fontSize: "md" }}
                  />
                </Stack>
                <Text color={"gray.600"}>{data?.description}</Text>
              </Stack>
              <Box border="1px" borderColor="gray.300" borderRadius="md" p="1">
                <Stack direction={"row"} spacing={4} align={"center"}>
                  <Box flex={1} />
                  <Stack
                    cursor="pointer"
                    direction={"column"}
                    spacing={1}
                    textAlign={"center"}
                    fontSize={"sm"}
                    onClick={handlePickDateClick}
                  >
                    <Text fontWeight={600}>Check-in</Text>
                    <Text color={"gray.500"}>
                      {startDate.toLocaleDateString()}
                    </Text>
                  </Stack>
                  <Box flex={1} />

                  <Stack
                    direction={"column"}
                    spacing={1}
                    textAlign={"center"}
                    fontSize={"sm"}
                  >
                    <Text fontSize="4xl" fontWeight="light">
                      |
                    </Text>
                  </Stack>
                  <Box flex={1} />
                  <Stack
                    cursor="pointer"
                    direction={"column"}
                    spacing={0}
                    textAlign={"center"}
                    fontSize={"sm"}
                    onClick={handlePickDateClick}
                  >
                    <Text fontWeight={600}>Check-out</Text>
                    <Text color={"gray.500"}>
                      {endDate.toLocaleDateString()}
                    </Text>
                  </Stack>
                  <Box flex={1} />
                </Stack>

                {isDatePickerVisible && (
                  <Box
                    position="relative"
                    top="100%"
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
              </Box>

              <HStack
                spacing={{ base: "4", md: "8" }}
                align="flex-end"
                justify="space-evenly"
              >
                <Box flex="1">
                  <QuantityPicker defaultValue={1} max={5} />
                </Box>
              </HStack>

              <Button
                colorScheme="pink"
                size="md"
                width="base"
                onClick={handleReserveClick}
              >
                Reserve
              </Button>

              <Divider mt="3" />
              <Box>
                <Flex justifyContent="space-between">
                  <Text
                    fontSize="lg"
                    fontWeight="medium"
                    decoration="underline"
                  >
                    € {data?.price} x {numDays} nights
                  </Text>
                  <Text fontSize="lg" fontWeight="medium">
                    € {totalPrice}
                  </Text>
                </Flex>

                <Divider mt="3" />
                <Flex justifyContent="space-between" mt={4}>
                  <Text fontSize="lg" fontWeight="medium">
                    Total
                  </Text>
                  <Text fontSize="lg" fontWeight="medium">
                    € {totalPrice}
                  </Text>
                </Flex>
              </Box>
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </>
  );
};
