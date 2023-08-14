import React, { useEffect, useState } from "react";
import {
  Box,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Input,
  Flex,
} from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";

const PriceRangeSlider = ({ setMaxValueContext, setMinValueContext }) => {
  const minValue = 0;
  const maxValue = 4000;

  const [sliderValues, setSliderValues] = useState<[number, number]>([
    minValue,
    maxValue,
  ]);

  useEffect(() => {
    setMinValueContext(sliderValues[0]);
    setMaxValueContext(sliderValues[1]);
  }, [sliderValues, setMinValueContext, setMaxValueContext]);

  const handleSliderChange = (values: number[]) => {
    const [minValue, maxValue] = values;

    // Ensure the slider values stay within the specified range
    const clampedMinValue = Math.max(minValue, 0);
    const clampedMaxValue = Math.max(clampedMinValue, Math.min(maxValue, 4000));

    // Limit the minimum value to be at most 3900
    const finalMinValue = Math.min(clampedMinValue, 3900);

    // Limit the maximum value to be within the range of 4000-100
    const finalMaxValue = Math.max(clampedMaxValue, 100);

    setSliderValues([finalMinValue, finalMaxValue]);
  };

  const handleMinInputChange = (value: number) => {
    // Ensure the input value is within the range of 0-3900
    const clampedMinValue = Math.max(0, Math.min(value, 3900));

    // Calculate the new maximum value to provide space between the sliders
    const newMaxValue = Math.max(clampedMinValue + 100, sliderValues[1]);

    setSliderValues([clampedMinValue, newMaxValue]);
  };

  const handleMaxInputChange = (value: number) => {
    // Ensure the input value is within the range of 4000-100
    const clampedMaxValue = Math.max(100, Math.min(value, 4000));

    // Calculate the new minimum value to provide space between the sliders
    const newMinValue = Math.min(clampedMaxValue - 100, sliderValues[0]);

    setSliderValues([newMinValue, clampedMaxValue]);
  };

  return (
    <Box>
      <Flex justifyContent="space-between">
        <RangeSlider
          aria-label={["min", "max"]}
          defaultValue={sliderValues}
          onChange={handleSliderChange}
          min={minValue}
          max={maxValue}
        >
          <RangeSliderTrack bg="gray.600">
            <RangeSliderFilledTrack bg="gray.300" />
          </RangeSliderTrack>
          <Flex>
            <RangeSliderThumb boxSize={6} index={0}>
              <Box color="black" as={MdGraphicEq} />
            </RangeSliderThumb>
            <Box width="20px" /> {/* Add space between thumbs */}
            <RangeSliderThumb boxSize={6} index={1}>
              <Box color="black" as={MdGraphicEq} />
            </RangeSliderThumb>
          </Flex>
        </RangeSlider>
      </Flex>
      <Flex justifyContent="space-between" mt={2}>
        <Input
          type="number"
          value={sliderValues[0]}
          onChange={(e) => handleMinInputChange(+e.target.value)}
          min={minValue}
          max={sliderValues[1] - 1}
          w="40%"
        />
        <Input
          type="number"
          value={sliderValues[1]}
          onChange={(e) => handleMaxInputChange(+e.target.value)}
          min={sliderValues[0] + 1}
          max={maxValue}
          w="40%"
        />
      </Flex>
    </Box>
  );
};

export default PriceRangeSlider;
