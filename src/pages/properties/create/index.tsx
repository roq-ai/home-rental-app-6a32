import {
  FormLabel,
  Button,
  Text,
  Box,
  Flex,
  Select,
  Stack,
  CheckboxGroup,
  Checkbox,
  Textarea,
} from "@chakra-ui/react";
import Breadcrumbs from "components/breadcrumb";
import { Error } from "components/error";
import { FormWrapper } from "components/form-wrapper";
import { TextInput } from "components/text-input";
import AppLayout from "layout/app-layout";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  FileUpload,
  requireNextAuth,
  withAuthorization,
} from "@roq/nextjs";
import { compose } from "lib/compose";

import { createProperty } from "apiSdk/properties";
import { propertyValidationSchema } from "validationSchema/properties";
import { PropertyInterface } from "interfaces/property";
import Map from "components/mapbox/Map";

function PropertyCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const amenitiesOptions = [
    { value: "Wi-Fi", name: "Wi-Fi" },
    { value: "Swimming Pool", name: "Swimming Pool" },
    { value: "Gym", name: "Gym" },
    { value: "Spa", name: "Spa" },
    { value: "Parking", name: "Parking" },
  ];
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");


  const handleSubmit = async (
    values: PropertyInterface,
    { resetForm }: FormikHelpers<any>
  ) => {
    setError(null);
    try {
      const propertyData = {
        ...values,
        image_urls: images,
      };
      const createResponse = await createProperty(propertyData);
      const propertyId = createResponse?.id;
      router.push(`/properties/view/${propertyId}`);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const handleUploadSuccess = ({ url }: any) => {
    setImages((prevImages) => [...prevImages, url]);
    formik.setFieldValue("image_urls", images);
  };

  const formik = useFormik<PropertyInterface>({
    initialValues: {
      name: "",
      description: "",
      price: "",
      num_of_guest: 1,
      num_of_beds: "",
      num_of_baths: "",
      amenities: [],
      image_urls: [],
      type: "",
      location: "",
      latitude: "",
      longitude: "",
      coords:"",
    },
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
              label: "Create Property",
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md" width="900">
        <Box mb={4}>
          <Text
            as="h1"
            fontSize={{ base: "1.5rem", md: "1.875rem" }}
            fontWeight="bold"
            color="base.content"
          >
            Create Property
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

          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            value={formik.values?.description}
            onChange={formik.handleChange}
          />

          <TextInput
            error={formik.errors.num_of_guest}
            label={"Max Guest"}
            props={{
              name: "num_of_guest",
              placeholder: "Max Guest",
              value: String(formik.values?.num_of_guest),
              onChange: (event: any) => {
                formik.handleChange(event);
                const intValue = parseInt(event.target.value, 10);
                formik.setFieldValue(
                  "num_of_guest",
                  isNaN(intValue) ? "" : intValue
                );
              },
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
            longitude={longitude}
            latitude={latitude}
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            onLocationSelect={({ name, longitude, latitude }: any) => {
              formik.setFieldValue("location", name ?? "");
              formik.setFieldValue("longitude", longitude);
              formik.setFieldValue("latitude", latitude);
              formik.setFieldValue("coords",`POINT(${parseFloat(longitude)} ${parseFloat(latitude)})`)
            }}
          />
          <TextInput
            label={"Address"}
            props={{
              name: "location",
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
              {amenitiesOptions.map((amenity) => (
                <Checkbox key={amenity.value} value={amenity.value}>
                  {amenity.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>

          <FileUpload
            accept={["image/*"]}
            fileCategory="USER_FILES"
            onUploadSuccess={handleUploadSuccess}
          />
          <Flex justifyContent={"flex-start"}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="primary.main"
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
                bg: "#ff585c",
                color: "white",
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
              onClick={() => router.push("/my-properties")}
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
    operation: AccessOperationEnum.CREATE,
  })
)(PropertyCreatePage);
