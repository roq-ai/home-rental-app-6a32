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
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
