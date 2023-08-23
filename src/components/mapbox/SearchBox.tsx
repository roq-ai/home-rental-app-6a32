import React, { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { useFilter } from "context/FilterContext";

function Search() {
  const [searched, setSearched] = useState("");
  const { setFilteredValue, setSearchResult } = useFilter();

  const handleRetrieve = (res: any) => {
    setFilteredValue(res.features?.[0].properties.name);
    setSearched(res.features?.[0].properties.name);
  };

  return (
    <SearchBox
      accessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
      value={searched}
      onRetrieve={handleRetrieve}
      placeholder="What are you looking for?"
    />
  );
}

export default Search;
