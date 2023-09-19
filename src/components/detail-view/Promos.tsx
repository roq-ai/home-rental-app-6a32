import { HStack, Icon, Stack, StackProps, Text, useColorModeValue } from '@chakra-ui/react';
import { RestaurantIcon } from 'icons/restaurant-icon';
import * as React from 'react';
import { BiCheckShield, BiCookie, BiPackage, BiTable } from 'react-icons/bi';
import { FaDesktop, FaFreeCodeCamp, FaShower, FaSpaceShuttle, FaTable } from 'react-icons/fa';
import { FiTv, FiWifi } from 'react-icons/fi';
import { IoCodeWorking } from 'react-icons/io5';
import { Ri24HoursLine, RiFocus2Line } from 'react-icons/ri';

const promose = [
  {
    icon: FiTv,
    text: 'TV',
  },
  {
    icon: FiWifi,
    text: 'Wifi',
  },
  {
    icon: FaShower,
    text: 'Shower',
  },
  {
    icon: RestaurantIcon,
    text: 'Kitchen',
  },
  {
    icon: RiFocus2Line,
    text: 'Dedicated workspace',
  },
  {
    icon: Ri24HoursLine,
    text: 'We’re here for you 24/7',
  },
];

export const Promos = (props: StackProps) => {
  const color = useColorModeValue('gray.600', 'gray.300');
  return (
    <Stack spacing="4" p="6" bg="whitesmoke" {...props}>
      <Text fontSize="lg" fontWeight="bold">
        What this place offers
      </Text>
      {promose.map((promo, id) => (
        <HStack key={id} spacing="3" color={color}>
          <Icon as={promo.icon} fontSize="xl" />
          <Text>{promo.text}</Text>
        </HStack>
      ))}
    </Stack>
  );
};
