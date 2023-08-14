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
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
  CheckboxGroup,
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
import { FunctionComponent, useState } from "react";
import * as yup from "yup";
import {
  AccessOperationEnum,
  AccessServiceEnum,
  FileUpload,
  requireNextAuth,
  useSession,
  withAuthorization,
} from "@roq/nextjs";
import { compose } from "lib/compose";

import { createProperty } from "apiSdk/properties";
import { propertyValidationSchema } from "validationSchema/properties";
import { CompanyInterface } from "interfaces/company";
import { getCompanies } from "apiSdk/companies";
import { PropertyInterface } from "interfaces/property";
import {
  CheckboxFilter,
  CheckboxFilterPopover,
} from "components/check-box/CheckBox";
import useSWR from "swr";

function PropertyCreatePage() {
  const router = useRouter();
  const { session } = useSession();
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const amenitiesOptions = [
    { value: "wifi", label: "Wi-Fi" },
    { value: "pool", label: "Pool" },
    { value: "gym", label: "Gym" },
    // Add other amenity options
  ];
  const handleSubmit = async (
    values: PropertyInterface,
    { resetForm }: FormikHelpers<any>
  ) => {
    setError(null);
    try {
      const propertyData = { ...values, image_urls: images };
      await createProperty(propertyData);
      resetForm();
      router.push("/properties");
    } catch (error) {
      setError(error);
    }
  };

  const {
    data: companyData,
    error: companyError,
    isLoading,
  } = useSWR<CompanyInterface[]>("/companies", () =>
    getCompanies().then(({ data }) => data)
  );

  const handleUploadSuccess = ({ url }: any) => {
    setImages((prevImages) => [...prevImages, url]);
    formik.setFieldValue("image_urls", images);
  };

  console.log({ images });
  console.log({ session });
  const formik = useFormik<PropertyInterface>({
    initialValues: {
      name: "",
      description: "",
      price: "",
      num_of_guest: "",
      num_of_beds: "",
      num_of_baths: "",
      amenities: [],
      image_urls: [],
      type: "",
      location: "",
      company_id: companyData?.[0]?.id,
    },
    validationSchema: propertyValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });
  console.log("Formik Values:", formik.values);

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
      <Box rounded="md">
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
          <TextInput
            error={formik.errors.type}
            label={"Type"}
            props={{
              name: "type",
              placeholder: "Type",
              value: formik.values?.type,
              onChange: formik.handleChange,
            }}
          />
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
          {/* <FormLabel mb="-3">Amenitites</FormLabel> */}
          {/* <CheckboxFilterPopover /> */}
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
                  {amenity.label}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          {/* <AsyncSelect<CompanyInterface>
            formik={formik}
            name={"company_id"}
            label={"Select Company"}
            placeholder={"Select Company"}
            fetcher={getCompanies}
            labelField={"name"}
          /> */}
          <FileUpload
            accept={["image/*"]}
            fileCategory="USER_FILES"
            onUploadSuccess={handleUploadSuccess}
          />
          {/* {formik.errors.attachement && <FormErrorMessage>{formik.errors?.attachement}</FormErrorMessage>} */}
          <Flex justifyContent={"flex-start"}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="pink.500"
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
                bg: "pink.500",
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
    operation: AccessOperationEnum.CREATE,
  })
)(PropertyCreatePage);
