import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
  Select,
  CheckboxGroup,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import DatePicker from "components/date-picker";
import { Error } from "components/error";
import { FormWrapper } from "components/form-wrapper";
import { NumberInput } from "components/number-input";
import { SelectInput } from "components/select-input";
import { AsyncSelect } from "components/async-select";
import { TextInput } from "components/text-input";
import AppLayout from "layout/app-layout";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import { FunctionComponent, useState, useRef } from "react";
import * as yup from "yup";
import useSWR from "swr";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
} from "@roq/nextjs";
import { compose } from "lib/compose";
import { ImagePicker } from "components/image-file-picker";
import { getPropertyById, updatePropertyById } from "apiSdk/properties";
import { propertyValidationSchema } from "validationSchema/properties";
import { PropertyInterface } from "interfaces/property";
import { CompanyInterface } from "interfaces/company";
import { getCompanies } from "apiSdk/companies";
import Map from "components/mapbox/Map";

function PropertyEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<PropertyInterface>(
    () => (id ? `/properties/${id}` : null),
    () => getPropertyById(id)
  );
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (
    values: PropertyInterface,
    { resetForm }: FormikHelpers<any>
  ) => {
    setFormError(null);
    try {
      const updated = await updatePropertyById(id, values);
      mutate(updated);
      resetForm();
      router.push("/my-properties");
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PropertyInterface>({
    initialValues: data,
    validationSchema: propertyValidationSchema,
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
              label: "Properties",
              link: "/properties",
            },
            {
              label: "Update Property",
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
            Update Property
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={"Name"}
            props={{
              name: "name",
              placeholder: "Name",
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.description}
            label={"Description"}
            props={{
              name: "description",
              placeholder: "Description",
              value: formik.values?.description,
              onChange: formik.handleChange,
            }}
          />
          <TextInput
            error={formik.errors.num_of_guest}
            label={"Max Guest"}
            props={{
              name: "num_of_guest",
              placeholder: "Max Guest",
              value: formik.values?.num_of_guest,
              onChange: formik.handleChange,
            }}
          />
          <TextInput
            error={formik.errors.num_of_baths}
            label={"Number of Baths"}
            props={{
              name: "num_of_baths",
              placeholder: "Number of Baths",
              value: formik.values?.num_of_baths,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.num_of_beds}
            label={"Number of Beds"}
            props={{
              name: "num_of_beds",
              placeholder: "Number of Beds",
              value: formik.values?.num_of_beds,
              onChange: formik.handleChange,
            }}
          />
          <TextInput
            error={formik.errors.price}
            label={"Price"}
            props={{
              name: "price",
              placeholder: "Price",
              value: formik.values?.price,
              onChange: formik.handleChange,
            }}
          />
          <FormLabel htmlFor="type">Type</FormLabel>
          <Select
            name="type"
            placeholder="Select Type"
            value={formik.values?.type}
            onChange={formik.handleChange}
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Guest House">Guest House</option>
          </Select>
          <Map
            longitude={data.longitude}
            latitude={data.latitude}
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            onLocationSelect={({
              name,
              longitude,
              latitude,
            }: {
              name: string;
              longitude: string;
              latitude: string;
            }) => {
              formik.setFieldValue("location", name ?? "");
              formik.setFieldValue("longitude", longitude);
              formik.setFieldValue("latitude", latitude);
            }}
          />
          <TextInput
            label={"Address"}
            props={{
              name: "Location",
              placeholder: "Location",
              value: formik.values?.location,
              onChange: formik.handleChange,
            }}
          />
          <TextInput
            error={formik.errors.longitude}
            label={"Longitude"}
            props={{
              name: "longitude",
              placeholder: "Longitude",
              value: formik.values?.longitude,
              onChange: formik.handleChange,
            }}
          />
          <TextInput
            error={formik.errors.latitude}
            label={"Latitude"}
            props={{
              name: "latitude",
              placeholder: "Latitude",
              value: formik.values?.latitude,
              onChange: formik.handleChange,
            }}
          />

          <CheckboxGroup
            value={formik.values.amenities}
            onChange={(selectedAmenities) =>
              formik.setFieldValue("amenities", selectedAmenities)
            }
          >
            <FormLabel mb="-3">Amenities</FormLabel>
            <Stack direction="column">
              {data.amenities.map((amenity, index) => (
                <Checkbox key={index} value={amenity}>
                  {amenity}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>

          <TextInput
            error={formik.errors.location}
            label={"Location"}
            props={{
              name: "location",
              placeholder: "Location",
              value: formik.values?.location,
              onChange: formik.handleChange,
            }}
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
              onClick={() => router.push("/properties")}
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
    entity: "property",
    operation: AccessOperationEnum.UPDATE,
  })
)(PropertyEditPage);
