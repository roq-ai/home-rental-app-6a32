import React, { useEffect, useRef, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { useFilter } from "context/FilterContext";
import { useToast } from "@chakra-ui/react";

function Search({ expanded }: { expanded: boolean }) {
  const searchBoxRef = useRef(null);
  const [searched, setSearched] = useState("");
  const {
    setFilteredValue,
    setSearchResult,
    setLatitude,
    setLongitude,
    isSearched,
    isSetSearched,
  } = useFilter();

  const toast = useToast();
  const handleRetrieve = (res: any) => {
    const response = res.features?.[0]?.properties?.coordinates;
    if (!response?.latitude && !response?.longitude) {
      toast({
        title: "Invalid location",
        description: "Search Valid,Please search again with another location",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setLatitude(response?.latitude);
    setLongitude(response?.longitude);
    setFilteredValue(res.features?.[0]?.properties?.name);
    setSearched(res.features?.[0]?.properties?.name);
  };

  const handleChange = (value: string) => {
    if (value === "") {
      isSetSearched(false);
      setSearchResult([]);
      setLatitude("");
      setLongitude("");
    }
  };
  useEffect(() => {
    // Focus the SearchBox when the component expands
    if (searchBoxRef.current && expanded) {
      searchBoxRef.current.focus();
    }
  }, [expanded]);

  return (
    <SearchBox
      ref={searchBoxRef} // Attach the ref to the SearchBox
      accessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
      value={searched}
      onChange={handleChange}
      onRetrieve={handleRetrieve}
      placeholder="What are you looking for?"
    />
  );
}

export default Search;
