import { Text, Box } from "@chakra-ui/react";
import Image from "next/image";

interface AppLogoProps {
  isMobile?: boolean;
}
export const AppLogo = (props: AppLogoProps) => {
  const { isMobile } = props;

  return (
    <Box maxW={{ lg: "lg", base: "90%" }}>
      <Image alt="ROQ Bnb" src="/roqbnb.png" width={120} height={50}></Image>
    </Box>
  );
};
