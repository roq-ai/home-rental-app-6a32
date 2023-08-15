import Image from "next/image";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { BiMessageAdd } from "react-icons/bi";
import { IoLocation } from "react-icons/io5";
import { Gallery } from "./image-carousel/Gallery";
import { images } from "./image-carousel/_data";

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
    <Box>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Box
          h={"210px"}
          bg={"gray.100"}
          mt={-6}
          mx={-6}
          mb={6}
          pos={"relative"}
        >
          <Box mx="auto">
            <Gallery images={data?.property?.image_urls} />
          </Box>
        </Box>

        {/* Check-in and Check-out section */}
        <Stack direction={"row"} spacing={4} align={"center"}>
          <Box flex={1} borderBottom={"1px"} borderColor={"gray.300"} />
          <Stack
            direction={"column"}
            spacing={1}
            textAlign={"center"}
            fontSize={"sm"}
          >
            <Text fontWeight={600}>Check-in</Text>
            <Text color={"gray.500"}>{checkIn}</Text>
          </Stack>
          <Box flex={1} borderBottom={"1px"} borderColor={"gray.300"} />
          <Stack
            direction={"column"}
            spacing={1}
            textAlign={"center"}
            fontSize={"sm"}
          >
            <Text fontWeight={600}>Check-out</Text>
            <Text color={"gray.500"}>{checkOut}</Text>
          </Stack>
          <Box flex={1} borderBottom={"1px"} borderColor={"gray.300"} />
        </Stack>
        <Divider mt="3" />

        <Flex justifyContent="space-between" mt={4}>
          <Text fontSize="sm" fontWeight="medium">
            Total Price
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            €{data?.total_price}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
