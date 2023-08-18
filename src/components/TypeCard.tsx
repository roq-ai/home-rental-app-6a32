import { Box, HStack, Text } from "@chakra-ui/react";
import { useRadioGroup, useRadio } from "@chakra-ui/radio";

function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        position="relative"
        _checked={{
          color: "black",
          borderColor: "gray.600",
          border: "2px",
          bg: "whitesmoke",
        }}
        mb="5"
        ml="5"
        px={10}
        py={35}
      >
        <Text fontSize="sm" size="sm">
          {props.children}
        </Text>
      </Box>
    </Box>
  );
}

export default function TypeCard({
  setSelectedPropertyType,
  setSelectedPropertyTypeContext,
}: any) {
  const options = ["Apartment", "House", "Guest House"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "Property Type",
    defaultValue: "",
    onChange: (value) => {
      if (value === setSelectedPropertyType) {
        setSelectedPropertyType("");
        setSelectedPropertyTypeContext("");
      } else {
        setSelectedPropertyType(value);
        setSelectedPropertyTypeContext(value);
      }
    },
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      <Box display="flex" flexDirection="row">
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </Box>
    </HStack>
  );
}
