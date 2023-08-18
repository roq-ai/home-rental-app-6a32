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
import NextLink from "next/link";
import { PriceTag } from "./PriceTag";
import { Gallery } from "components/image-carousel/Gallery";
import { images } from "components/image-carousel/_data";

export default function PropertyCard({ data }: any) {
  return (
    <NextLink href={`/properties/view/${data.id}`} key={data.id}>
      <Box>
        <Box
          maxW={"300px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          rounded={"md"}
          // p={6}
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
            <Box mx="auto" p={6}>
              <Gallery images={data.image_urls} data={data} />
            </Box>
          </Box>

          <NextLink href={`/properties/view/${data.id}`} key={data.id}>
            <Stack py={6} direction={"row"} spacing={4} align={"center"}>
              <Stack direction={"column"} fontSize={"sm"}>
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  color={useColorModeValue("gray.900", "gray.900")}
                >
                  {data.location.split(",")}
                </Text>

                <Text
                  fontSize="sm"
                  fontWeight="normal"
                  color={useColorModeValue("gray.700", "gray.400")}
                >
                  {data.name}
                </Text>
                <PriceTag currency="USD" price={data.price} />
              </Stack>
            </Stack>
          </NextLink>
        </Box>
      </Box>
    </NextLink>
  );
}
