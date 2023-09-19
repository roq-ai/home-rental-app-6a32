import {
  Box,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  Stack,
  StackProps,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { FilterPopoverButton, FilterPopoverContent } from "./FilterPopover";
import { useFilterState } from "./useFilterState";
import { blueFilters } from "./_data";

type CheckboxFilterProps = Omit<CheckboxGroupProps, "onChange"> & {
  hideLabel?: boolean;
  options: Array<{ label: string; value: string; count?: number }>;
  label?: string;
  onChange?: (value: string[]) => void;
  spacing?: StackProps["spacing"];
  showSearch?: boolean;
};

export const CheckboxFilter = (props: CheckboxFilterProps) => {
  const {
    options,
    label,
    hideLabel,
    spacing = "2",
    showSearch,
    ...rest
  } = props;

  return (
    <Stack as="fieldset" spacing={spacing}>
      {!hideLabel && (
        <FormLabel fontWeight="semibold" as="legend" mb="0">
          {label}
        </FormLabel>
      )}
      {showSearch && (
        <InputGroup size="md" pb="1">
          <Input
            placeholder="Search..."
            rounded="md"
            focusBorderColor={mode("gray.800", "gray.700")}
          />
          <InputRightElement
            pointerEvents="none"
            color="gray.400"
            fontSize="lg"
          >
            <FiSearch />
          </InputRightElement>
        </InputGroup>
      )}
      <CheckboxGroup {...rest}>
        {options?.map((option) => (
          <Checkbox key={option.value} value={option.value} colorScheme="blue">
            <span>{option.label}</span>
            {option.count != null && (
              <Box as="span" color="gray.500" fontSize="sm">
                {" "}
                ({option.count})
              </Box>
            )}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </Stack>
  );
};

export const CheckboxFilterPopover = () => {
  const state = useFilterState({
    defaultValue: blueFilters.defaultValue,
    onSubmit: console.log,
  });
  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Select Amenities" />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <CheckboxFilter
          hideLabel
          value={state.value}
          onChange={(v) => state.onChange(v)}
          options={blueFilters.options}
        />
      </FilterPopoverContent>
    </Popover>
  );
};
