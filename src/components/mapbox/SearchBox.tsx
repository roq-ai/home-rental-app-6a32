import React, { useEffect, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { useFilter } from "context/FilterContext";

function Search() {
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

  useEffect(() => {});

  const handleRetrieve = (res: any) => {
    const { latitude, longitude } = res.features?.[0]?.properties?.coordinates;
    console.log({ res });
    setLatitude(latitude);
    setLongitude(longitude);
    setFilteredValue(res.features?.[0]?.properties?.name);
    setSearched(res.features?.[0]?.properties?.name);
  };

  const handleChange = (value: string) => {
    if (value === "") {
      isSetSearched(false);
      setSearchResult([]);
    }
  };
  return (
    <SearchBox
      accessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
      value={searched}
      onChange={handleChange}
      onRetrieve={handleRetrieve}
      placeholder="What are you looking for?"
    />
  );
}

export default Search;
