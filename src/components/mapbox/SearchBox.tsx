import React, { useEffect, useRef, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { useFilter } from "context/FilterContext";

function Search({ expanded }) {
  const searchBoxRef = useRef(null); 
  const [searched, setSearched] = useState("");
  console.log({ searched });
  const {
    setFilteredValue,
    setSearchResult,
    setLatitude,
    setLongitude,
    isSearched,

    isSetSearched,
  } = useFilter();

  const handleRetrieve = (res: any) => {
    const { latitude, longitude } = res.features?.[0]?.properties?.coordinates;

    setLatitude(latitude);
    setLongitude(longitude);

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
