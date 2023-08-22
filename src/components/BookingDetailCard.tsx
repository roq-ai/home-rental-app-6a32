import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { BiMessageAdd } from "react-icons/bi";
import { IoLocation } from "react-icons/io5";
import { Gallery } from "./image-carousel/Gallery";
import { ChatWindow, useAuthorizationApi } from "@roq/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";

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
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();

  return (
    <Box>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
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
          <Stack direction={"column"} spacing={1} fontSize={"sm"}>
            <Text fontWeight={600}>Check-out</Text>
            <Text color={"gray.500"}>{checkOut}</Text>
          </Stack>
          <Box flex={1} borderBottom={"1px"} borderColor={"gray.300"} />
        </Stack>
        <Divider mt="3" />
        <Link
          href={{
            pathname: "/messagehost",
            query: { conversationId: data.roqConversationId, id: data.id },
          }}
        >
          <Stack
            direction={"row"}
            spacing={4}
            align={"center"}
            mt={3}
            cursor="pointer"
          >
            <BiMessageAdd />
            <Flex direction="column">
              <Text fontSize="sm">Message</Text>
            </Flex>
          </Stack>
        </Link>

        <Divider mt="3" />
        <Stack direction={"row"} align={"center"} mt={3}>
          <Box>
            <IoLocation />
          </Box>
          <Flex direction="column">
            <Text fontSize="sm">{data?.property.location}</Text>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
}
