import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Gallery } from "./Gallery";
import { PriceTag } from "./PriceTag";
import { QuantityPicker } from "./QuantityPicker";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useRef, useState } from "react";
import { Promos } from "./Promos";
import { createBooking } from "apiSdk/bookings";
import { useRouter } from "next/router";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  useAuthorizationApi,
  useSession,
} from "@roq/nextjs";
import useSWR from "swr";
import { getUsers } from "apiSdk/users";
import { UserInterface } from "interfaces/user";

import { FiEdit2 } from "react-icons/fi";
import NextLink from "next/link";
export const DetailContainer = (props: any) => {
  const { session, status } = useSession();
  const { data, rootProps } = props;
  const router = useRouter();
  const { hasAccess } = useAuthorizationApi();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [reserveIsLoading, setReserveIsLoading] = useState(false);
  const [guest, setGuest] = useState<string>("1");
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
  function formatDate(date: any) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }

  const handleSelect = (ranges: any) => {
    console.log(ranges, "ranges");
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
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
    setReserveIsLoading(true);
    if (status === "unauthenticated") {
      router.push("/login");
    }
    try {
      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(endDate);

      const bookingData = {
        start_date: startDateFormatted,
        end_date: endDateFormatted,
        guest_id: fetchedData?.[0]?.id,
        property_id: data?.id,
        num_of_guest: parseInt(guest),
        num_of_night: String(numDays),
        total_price: String(totalPrice),
      };

      const bookingresponse = await createBooking(bookingData);

      if (bookingresponse && bookingresponse.identifier) {
        toast({
          title: "Property Already Reserved",
          description:
            "This property is already reserved for the selected dates.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (
        (bookingresponse && bookingresponse.identifier == null) ||
        bookingresponse.identifier == null
      ) {
        const bookingId = bookingresponse?.id;
        router.push(`/bookings/view/${bookingId}`);
      }
    } catch (error) {
    } finally {
      setReserveIsLoading(false);
    }
  };
  const datePickerRef = useRef(null);

  const handlePickDateClick = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  const handleClickOutside = (event: any) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setDatePickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("from container", { data });

  return (
    <>
      {hasAccess(
        "property",
        AccessOperationEnum.UPDATE,
        AccessServiceEnum.PROJECT
      ) && (
        <NextLink
          href={`/my-properties/edit/${data.id}`}
          passHref
          legacyBehavior
        >
          <Button
            onClick={(e) => e.stopPropagation()}
            mr={2}
            mb={5}
            padding="0rem 0.5rem"
            height="24px"
            fontSize="0.8rem"
            variant="outline"
            color="primary.main"
            borderRadius="6px"
            border="1px"
            borderColor="state.info.transparent"
            leftIcon={
              <FiEdit2 width="12px" height="12px" color="state.info.main" />
            }
            alignSelf="flex-end"
          >
            Edit
          </Button>
        </NextLink>
      )}
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
        {session?.user?.roles?.[0] === "guest" ||
        status === "unauthenticated" ? (
          <Box flex="1" boxShadow="md" bg="white" borderRadius="md" p={8}>
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
                    ref={datePickerRef}
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
                  <QuantityPicker
                    defaultValue={1}
                    min={1}
                    max={data.num_of_guest}
                    setGuest={setGuest}
                  />
                </Box>
              </HStack>

              <Button
                colorScheme="primary.main"
                size="md"
                width="base"
                background="primary.main"
                color="white"
                onClick={handleReserveClick}
                disabled={reserveIsLoading}
                isLoading={reserveIsLoading}
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
