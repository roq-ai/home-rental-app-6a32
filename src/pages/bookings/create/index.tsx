import {
  FormControl,
  FormLabel,
  Button,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import DatePicker from "components/date-picker";
import { Error } from "components/error";
import { FormWrapper } from "components/form-wrapper";
import { AsyncSelect } from "components/async-select";
import AppLayout from "layout/app-layout";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
} from "@roq/nextjs";
import { compose } from "lib/compose";

import { createBooking } from "apiSdk/bookings";
import { bookingValidationSchema } from "validationSchema/bookings";
import { UserInterface } from "interfaces/user";
import { PropertyInterface } from "interfaces/property";
import { getUsers } from "apiSdk/users";
import { getProperties } from "apiSdk/properties";
import { BookingInterface } from "interfaces/booking";

function BookingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (
    values: BookingInterface,
    { resetForm }: FormikHelpers<any>
  ) => {
    setError(null);
    try {
      await createBooking(values);
      resetForm();
      router.push("/bookings");
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BookingInterface>({
    initialValues: {
      start_date: new Date(new Date().toDateString()),
      end_date: new Date(new Date().toDateString()),
      guest_id: (router.query.guest_id as string) ?? null,
      property_id: (router.query.property_id as string) ?? null,
    },
    validationSchema: bookingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

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
              label: "Create Booking",
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text
            as="h1"
            fontSize={{ base: "1.5rem", md: "1.875rem" }}
            fontWeight="bold"
            color="base.content"
          >
            Create Booking
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="start_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Start Date
            </FormLabel>
            <DatePicker
              selected={
                formik.values?.start_date
                  ? new Date(formik.values?.start_date)
                  : null
              }
              onChange={(value: Date) =>
                formik.setFieldValue("start_date", value)
              }
            />
          </FormControl>
          <FormControl id="end_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              End Date
            </FormLabel>
            <DatePicker
              selected={
                formik.values?.end_date
                  ? new Date(formik.values?.end_date)
                  : null
              }
              onChange={(value: Date) =>
                formik.setFieldValue("end_date", value)
              }
            />
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={"guest_id"}
            label={"Select User"}
            placeholder={"Select User"}
            fetcher={getUsers}
            labelField={"email"}
          />
          <AsyncSelect<PropertyInterface>
            formik={formik}
            name={"property_id"}
            label={"Select Property"}
            placeholder={"Select Property"}
            fetcher={getProperties}
            labelField={"name"}
          />
          <Flex justifyContent={"flex-start"}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: "state.info.main",
                color: "base.100",
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push("/bookings")}
              _hover={{
                bg: "neutral.transparent",
                color: "neutral.main",
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
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
    operation: AccessOperationEnum.CREATE,
  })
)(BookingCreatePage);
