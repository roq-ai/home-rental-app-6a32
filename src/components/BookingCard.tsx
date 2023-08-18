import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Gallery } from "./image-carousel/Gallery";
import NextLink from "next/link";

export default function BookingCard({ data }: any) {
  const checkIn = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(data.start_date));
  const checkOut = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(data.end_date));
  return (
    <NextLink href={`/bookings/view/${data.id}`} key={data.id}>
      <Box>
        <Box
          maxW={"320px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          rounded={"md"}
          overflow={"hidden"}
        >
          <Box h={"210px"} bg={"gray.100"} m={3} mb={6} pos={"relative"}>
            <Box mx="auto">
              <Gallery images={data?.property?.image_urls} />
            </Box>
          </Box>

          <Stack>
            <Text m={3} fontSize="md">
              {data?.property?.location}
            </Text>
          </Stack>
          <Stack
            direction={"row"}
            justify={"space-between"}
            mx={3}
            spacing={6}
            align={"center"}
          >
            <Stack direction={"column"} spacing={1} fontSize={"sm"}>
              <Text fontWeight={600}>Check-in</Text>
              <Text color={"gray.500"}>{checkIn}</Text>
            </Stack>
            <Stack
              direction={"column"}
              spacing={1}
              textAlign={"center"}
              fontSize={"sm"}
            >
              <Text fontWeight={600}>Check-out</Text>
              <Text color={"gray.500"}>{checkOut}</Text>
            </Stack>
          </Stack>
          <Divider mt="3" />

          <Flex justifyContent="space-between" mx={4} my={2}>
            <Text fontSize="sm" fontWeight="medium">
              Total Price
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              €{data?.total_price}
            </Text>
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
}
