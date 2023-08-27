import { signIn, signUp, requireNextAuth, useSession } from "@roq/nextjs";
import HomeLayout from "layout/home-layout";
import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { CustomButton } from "components/custom-button";
import Head from "next/head";
import { PoweredBy } from "components/powered-by";
import { HelpBox } from "components/help-box";
import { useRouter } from "next/router";

const Card: FC<{
  userTypeName: string;
  onSignup?: () => void;
  onLogin?: () => void;
  rootClass?: string;
  type?: string;
}> = ({ userTypeName, rootClass = "", type = "" }) => (
  <Box
    width={{ md: "310px" }}
    bgColor="base.200"
    p="18px"
    border="1px solid"
    borderColor="base.300"
    borderRadius="8px"
    className={rootClass}
  >
    <Text fontSize="xl" color="base.content" fontWeight={600} mb="24px">
      {userTypeName}
    </Text>
    <Box display="flex">
      <CustomButton
        flex={1}
        weight="primary"
        _hover={{ bg: "primary.focus" }}
        onClick={() => signUp(type)}
      >
        Signup
      </CustomButton>
      <CustomButton
        onClick={() => signIn(type)}
        flex={{ base: 1, lg: "0 0 131px" }}
        weight="secondary"
        ml="12px"
      >
        Login
      </CustomButton>
    </Box>
  </Box>
);
let currentUser: any;
function HomePage() {
  const { session } = useSession();
  currentUser = session?.user?.roles?.[0];

  return (
    <>
      <Head>
        <title>{`Home Rental App`}</title>

        <meta
          name="description"
          content="Experience seamless home rentals with Home Rental App - your ultimate platform for easy search, detailed listings, efficient booking, and effective communication for both guests and hosts."
        />
      </Head>
      <HomeLayout>
        <Box
          position="relative"
          display="flex"
          flex={{ lg: "0 0 485px" }}
          height={{ base: "180px", lg: "auto" }}
        >
          <Image
            flex="1"
            src={
              "https://images.unsplash.com/photo-1522444195799-478538b28823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NjA3NjB8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVudGFsfGVufDB8fHx8MTY5MTY2NDU1M3ww&ixlib=rb-4.0.3&q=80&w=1080"
            }
            alt="Dinner"
            objectFit="cover"
            objectPosition="center"
          />
          <Box
            position="absolute"
            top="0"
            backgroundColor="rgba(0,0,0,0.6)"
            width="100%"
            py="2"
          >
            <Text align="center" fontSize="sm" color="white">
              Photo by{" "}
              <Link
                href="https://unsplash.com/@brina_blum?utm_source=roq-generator&utm_medium=referral"
                isExternal
                color="teal.200"
              >{`Brina Blum`}</Link>{" "}
              on{" "}
              <Link
                href="https://unsplash.com/?utm_source=roq-generator&utm_medium=referral"
                isExternal
                color="teal.200"
              >
                Unsplash
              </Link>
            </Text>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          padding={{ base: "32px 16px", lg: "32px 64px", xl: "64px 128px" }}
          overflow="auto"
        >
          <Box>
            <Heading mb={{ base: "12px", lg: "20px" }} size="2xl">
              {`Home Rental App`}
            </Heading>
            <Text
              size="2xl"
              mb={{ base: "32px", lg: "48px" }}
              color="base.content"
              opacity="0.6"
            >
              {`Experience seamless home rentals with Home Rental App - your ultimate platform for easy search, detailed listings, efficient booking, and effective communication for both guests and hosts.`}
            </Text>
            <Box
              className="roles-container"
              display={"flex"}
              flexDirection={"column"}
              w={{ base: "100%", md: "fit-content" }}
            >
              <Stack direction="column" spacing={6}>
                <Card userTypeName="Host" type="host" />

                <Card userTypeName="Guest" type="guest" />
              </Stack>
            </Box>
          </Box>
          <Box pt={4}>
            <HelpBox />
            <PoweredBy />
          </Box>
        </Box>
      </HomeLayout>
    </>
  );
}

export default requireNextAuth({
  redirectIfAuthenticated: true,
  redirectTo: "/properties",
})(HomePage);
