import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { Children, isValidElement, useMemo } from "react";
interface allInputFields extends SimpleGridProps {
  base?: number;
  small?: number;
  medium?: number;
  large?: number;
  extra?: number;
}
export const PropertyGrid = (props: allInputFields) => {
  const columns = useMemo(() => {
    const count = Children.toArray(props.children).filter(
      isValidElement
    ).length;
    return {
      base: Math.min(props?.base ? props?.base : 1, count),
      sm: Math.min(props?.small ? props?.small : 1, count),
      md: Math.min(props?.medium ? props?.medium : 1, count),
      lg: Math.min(props?.large ? props?.large : 1, count),
      xl: Math.min(props?.extra ? props?.extra : 1, count),
    };
  }, [props.children]);

  return (
    <SimpleGrid
      columns={columns}
      columnGap={{ base: "4", md: "6" }}
      rowGap={{ base: "8", md: "10" }}
      {...props}
    />
  );
};
