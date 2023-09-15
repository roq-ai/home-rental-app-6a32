import {
  Box,
  Center,
  Flex,
  Spinner,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import { Error } from "components/error";
import { FormWrapper } from "components/form-wrapper";
import AppLayout from "layout/app-layout";
import NextLink from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { compose } from "lib/compose";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  useSession,
  withAuthorization,
} from "@roq/nextjs";
import { FiEdit2 } from "react-icons/fi";

import { getBookingById } from "apiSdk/bookings";
import { BookingInterface } from "interfaces/booking";
import BookingDetailCard from "components/booking-section/BookingDetailCard";
import LocationMap from "components/mapbox/LocationMap";
import BookingMap from "components/mapbox/BookingMap";

function BookingViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const { session } = useSession();
  const currentUser = session.user.roles?.[0];
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BookingInterface>(
    () => (id ? `/bookings/${id}` : null),
    () =>
      getBookingById(id, {
        relations: ["user", "property"],
      })
  );

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: "Bookings",
              link: "/bookings",
            },
            {
              label: "Booking Details",
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper wrapperProps={{ border: "none", gap: 3, p: 0 }}>
              <Flex
                alignItems="center"
                w="full"
                justifyContent={"space-between"}
              >
                <Box>
                  <Text
                    sx={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      color: "base.content",
                    }}
                  >
                    Booking Details
                  </Text>
                </Box>
                {hasAccess(
                  "booking",
                  AccessOperationEnum.UPDATE,
                  AccessServiceEnum.PROJECT
                ) &&
                  currentUser === "guest" && (
                    <NextLink
                      href={`/bookings/edit/${id}`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        mr={2}
                        padding="0rem 0.5rem"
                        height="24px"
                        fontSize="0.75rem"
                        variant="outline"
                        color="state.info.main"
                        borderRadius="6px"
                        border="1px"
                        borderColor="state.info.transparent"
                        leftIcon={
                          <FiEdit2
                            width="12px"
                            height="12px"
                            color="state.info.main"
                          />
                        }
                      >
                        Edit
                      </Button>
                    </NextLink>
                  )}
              </Flex>

              <Box
                maxW="7xl"
                mx="auto"
                px={{ base: "4", md: "8", lg: "12" }}
                py={{ base: "6", md: "8", lg: "12" }}
              >
                <Stack
                  direction={{ base: "column", md: "column", lg: "row" }}
                  spacing={{ base: "6", lg: "12", xl: "16" }}
                >
                  <Box minH="200px">
                    <BookingDetailCard data={data} />
                  </Box>

                  <Box>
                    <BookingMap
                      latitude={data.property.latitude as unknown as number}
                      longitude={data.property.longitude as unknown as number}
                    />
                  </Box>
                </Stack>
              </Box>
            </FormWrapper>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: "/",
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: "booking",
    operation: AccessOperationEnum.READ,
  })
)(BookingViewPage);
