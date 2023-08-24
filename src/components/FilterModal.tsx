import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
  Box,
  Grid,
  Text,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { Checkbox, VStack, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiFilter } from "react-icons/fi";
import Picker from "./Picker";
import PriceRangeSlider from "./PriceRange";
import TypeCard from "./TypeCard";
import { useFilter } from "context/FilterContext";
import { BiFilter } from "react-icons/bi";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
interface Amenity {
  id: number;
  name: string;
}

const amenitiesList: Amenity[] = [
  { id: 1, name: "Wi-Fi" },
  { id: 2, name: "Swimming Pool" },
  { id: 3, name: "Gym" },
  { id: 4, name: "Spa" },
  { id: 5, name: "Parking" },
];
const FormModal = () => {
  const handleSubmit = (values: any, actions: any) => {
    actions.setSubmitting(false);
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<string>("");
  const [selectedBaths, setSelectedBaths] = useState<string>("");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const {
    setSelectedAmenities: setSelectedAmenitiesContext,
    setSelectedBaths: setSelectedBathsContext,
    setSelectedBeds: setSelectedBedsContext,
    setSelectedPropertyType: setSelectedPropertyTypeContext,
    setMinValue: setMinValueContext,
    setMaxValue: setMaxValueContext,
    FilterNumber,
  } = useFilter();

  const toggleAmenity = (amenityName: string) => {
    if (selectedAmenities.includes(amenityName)) {
      setSelectedAmenities(
        selectedAmenities.filter((name) => name !== amenityName)
      );
      setSelectedAmenitiesContext(
        selectedAmenities.filter((name) => name !== amenityName)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenityName]);
      setSelectedAmenitiesContext([...selectedAmenities, amenityName]);
    }
  };
  const handleClear = () => {
    setSelectedAmenities([]);
    setSelectedBeds("");
    setSelectedBaths("");
    setSelectedPropertyType("");
    setMinValue("");
    setMaxValue("");
    setSelectedAmenitiesContext([]);
    setSelectedBedsContext("");
    setSelectedBathsContext("");
    setSelectedPropertyTypeContext("");
    setMinValueContext("");
    setMaxValueContext("");
  };
  console.log("amentities", selectedAmenities);
  console.log("value 1", selectedBeds);
  console.log("value 2", selectedBeds);
  console.log("value 3", selectedPropertyType);
  return (
    <Box>
      <Button
        leftIcon={<FiFilter />}
        variant="solid"
        background="primary.main"
        color="white"
        borderRadius="2xl"
        onClick={onOpen}
        _hover={{
          background: "primary.main",
          color: "white",
        }}
      >
        Filter
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxW={"65%"}
          p={10}
          css={{
            width: "50%",
            maxHeight: "70vh",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#333 #333",
            "&::-webkit-scrollbar": {
              width: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#333",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f0e6f6",
            },
            overflowX: "hidden",
          }}
        >
          <ModalHeader mx="auto">Filters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "", email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Divider
                    color="black"
                    size="md"
                    colorScheme="primary.main"
                    mb="2"
                  />
                  <VStack align="start" spacing={2}>
                    <Heading size="md" fontSize="lg">
                      Select Amenities
                    </Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
                      {amenitiesList.map((amenity) => (
                        <Box key={amenity.id} p={2}>
                          <Checkbox
                            size="md"
                            iconSize="1em"
                            borderColor="gray"
                            isChecked={selectedAmenities.includes(amenity.name)}
                            onChange={() => toggleAmenity(amenity.name)}
                          >
                            <Text fontSize="md">{amenity.name}</Text>
                          </Checkbox>
                        </Box>
                      ))}
                    </Grid>
                  </VStack>
                  <Divider
                    color="black"
                    size="md"
                    colorScheme="primary.main"
                    mb="3"
                    mt="3"
                  />
                  <Box mb="3">
                    <Picker
                      label="Beds"
                      value={selectedBeds}
                      onChange={(newValue) => {
                        setSelectedBeds(newValue);
                        setSelectedBedsContext(newValue);
                      }}
                      options={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                        { label: "6", value: "6" },
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                      ]}
                    />
                  </Box>
                  <Box>
                    <Picker
                      label="Baths"
                      value={selectedBaths}
                      onChange={(newValue) => {
                        setSelectedBaths(newValue);
                        setSelectedBathsContext(newValue);
                      }}
                      options={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                      ]}
                    />
                  </Box>

                  <Divider
                    color="black"
                    size="md"
                    colorScheme="primary.main"
                    mt="3"
                    mb="3"
                  />
                  <PriceRangeSlider
                    setMaxValueContext={setMaxValueContext}
                    setMinValueContext={setMinValueContext}
                  />
                  <Divider
                    color="black"
                    size="md"
                    colorScheme="#ff385c"
                    mt="3"
                    mb="3"
                  />

                  <Box>
                    <Text fontSize="md" size="md" fontWeight="bold" mb="4">
                      Property Type
                    </Text>
                    <TypeCard
                      setSelectedPropertyType={setSelectedPropertyType}
                      setSelectedPropertyTypeContext={
                        setSelectedPropertyTypeContext
                      }
                    />
                  </Box>
                  <Divider
                    color="black"
                    size="md"
                    colorScheme="#ff385c"
                    mt="3"
                    mb="3"
                  />

                  <ModalFooter display="flex" justifyContent="space-around">
                    <Button
                      color="black"
                      mr={3}
                      onClick={handleClear}
                      variant="link"
                    >
                      Clear
                    </Button>
                    <Box>
                      <Button
                        leftIcon={<BiFilter />}
                        variant="solid"
                        background="black"
                        color="white"
                        borderRadius="2xl"
                        onClick={onClose}
                        _hover={{
                          background: "black",
                          color: "white",
                        }}
                        size="md"
                      >
                        Show Filter
                        <Badge
                          color="black"
                          bg="white"
                          ml={4}
                          fontSize="sm"
                          borderRadius="full"
                        >
                          {FilterNumber || 0}
                        </Badge>
                      </Button>
                    </Box>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FormModal;
