import {
  Box,
  Center,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { BiMessageAdd } from "react-icons/bi";
import { IoLocation } from "react-icons/io5";
import { Gallery } from "./image-carousel/Gallery";

export default function BookingDetailCard({ data }: any) {
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
    // <Center>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        // boxShadow={"2xl"}
        // border="1px lightgray solid"
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
            <Gallery images={data?.property.image_urls} />
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
            fontSize={"sm"}
          >
            <Text fontWeight={600}>Check-out</Text>
            <Text color={"gray.500"}>{checkOut}</Text>
          </Stack>
          <Box flex={1} borderBottom={"1px"} borderColor={"gray.300"} />
        </Stack>
        <Divider mt="3" />
        <Stack direction={"row"} spacing={4} align={"center"} mt={3}>
          <BiMessageAdd />
          <Flex direction="column">
            {/* <Text>Message For Host</Text> */}
            <Text fontSize="md">Message for host</Text>
          </Flex>
        </Stack>
        <Divider mt="3" />
        <Stack direction={"row"} spacing={4} align={"center"} mt={3}>
          <IoLocation />
          <Flex direction="column">
            {/* <Text>Your Place</Text> */}
            <Text fontSize="sm">{data?.property.location}</Text>
          </Flex>
        </Stack>
      </Box>
   
  );
}
