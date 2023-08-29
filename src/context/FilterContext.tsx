import { PropertyInterface } from "interfaces/property";
import React, { createContext, useContext, useState } from "react";

type FilterContextType = {
  filteredValue: string;
  setFilteredValue: React.Dispatch<React.SetStateAction<string>>;
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBeds: string;
  setSelectedBeds: React.Dispatch<React.SetStateAction<string>>;
  selectedBaths: string;
  setSelectedBaths: React.Dispatch<React.SetStateAction<string>>;
  selectedPropertyType: string;
  setSelectedPropertyType: React.Dispatch<React.SetStateAction<string>>;
  minValue: string;
  setMinValue: React.Dispatch<React.SetStateAction<string>>;
  maxValue: string;
  setMaxValue: React.Dispatch<React.SetStateAction<string>>;
  FilterNumber: string;
  setFilterNumber: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  latitude: string;
  setLatitude: React.Dispatch<React.SetStateAction<string>>;
  longitude: string;
  setLongitude: React.Dispatch<React.SetStateAction<string>>;
  searchResult: PropertyInterface[];
  setSearchResult: React.Dispatch<React.SetStateAction<PropertyInterface[]>>;
  guest: number;
  setGuest: React.Dispatch<React.SetStateAction<number>>;
  searchedLat: string;
  setSearchedLat: React.Dispatch<React.SetStateAction<string>>;
  searchedLong: string;
  setSearchedLong: React.Dispatch<React.SetStateAction<string>>;
  isSearched: boolean;
  isSetSearched: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider = ({ children }: any) => {
  const [filteredValue, setFilteredValue] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<string>("");
  const [selectedBaths, setSelectedBaths] = useState<string>("");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [FilterNumber, setFilterNumber] = useState("");
  const [location, setLocation] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [guest, setGuest] = useState(1);
  const [searchedLat, setSearchedLat] = useState("");
  const [searchedLong, setSearchedLong] = useState("");
  const [isSearched, isSetSearched] = useState(false);

  return (
    <FilterContext.Provider
      value={{
        filteredValue,
        setFilteredValue,
        selectedAmenities,
        setSelectedAmenities,
        selectedBeds,
        setSelectedBeds,
        selectedBaths,
        setSelectedBaths,
        selectedPropertyType,
        setSelectedPropertyType,
        minValue,
        setMinValue,
        maxValue,
        setMaxValue,
        FilterNumber,
        setFilterNumber,
        latitude,
        location,
        longitude,
        setLatitude,
        setLocation,
        setLongitude,
        searchResult,
        setSearchResult,
        guest,
        setGuest,
        searchedLat,
        searchedLong,
        setSearchedLat,
        setSearchedLong,
        isSearched,
        isSetSearched,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
