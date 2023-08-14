import {
  Button,
  chakra,
  useColorModeValue,
  useRadio,
  UseRadioProps,
  useTheme,
  VisuallyHidden,
  FormControl,
  FormControlProps,
  HStack,
  useRadioGroup,
  UseRadioGroupProps,
  Text,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import * as React from "react";

export type PickerButtonProps = UseRadioProps & {
  label?: string;
};
interface Option {
  label: string;
  value: string;
}

interface PickerProps extends UseRadioGroupProps {
  options: Option[];
  rootProps?: FormControlProps;
  hideLabel?: boolean;
  label?: string;
}

export const Picker = (props: PickerProps) => {
  const { options, rootProps, hideLabel, label, ...rest } = props;
  const { getRadioProps, getRootProps, value } = useRadioGroup(rest);
  const selectedOption = options.find((option) => option.value == value);

  return (
    <FormControl {...rootProps}>
      {!hideLabel && (
        <Text fontSize="lg" fontWeight="bold">
          {label ?? `Size: ${selectedOption?.label}`}
        </Text>
      )}
      <HStack {...getRootProps()} mt="3">
        {options.map((option) => (
          <PickerButton
            key={option.value}
            label={option.label}
            {...getRadioProps({ value: option.value })}
          />
        ))}
      </HStack>
    </FormControl>
  );
};

const PickerButton = (props: PickerButtonProps) => {
  const { value, label } = props;
  const { getInputProps, htmlProps, getCheckboxProps, getLabelProps } =
    useRadio(props);
  const theme = useTheme();

  return (
    <chakra.label {...htmlProps}>
      <chakra.input {...getInputProps()} />
      <Button
        as="span"
        px="7"
        py="4" // Increase button padding
        m="1" // Add margin to create space between buttons
        cursor="pointer"
        variant="outline"
        colorScheme="blackAlpha"
        color={useColorModeValue("gray.600", "gray.400")}
        borderRadius="full"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        _checked={{
          color: useColorModeValue("black", "white"),
          bg: useColorModeValue(
            "white.50",
            transparentize("pink.200", 0.12)(theme)
          ),
          borderColor: useColorModeValue("black", "pink.200"),
          borderWidth: "2px",
        }}
        _focus={{ boxShadow: "none" }}
        _focusVisible={{ boxShadow: "outline" }}
        {...getCheckboxProps()}
      >
        {value}
      </Button>
      <VisuallyHidden {...getLabelProps()}>{label} selected</VisuallyHidden>
    </chakra.label>
  );
};

export default Picker;
