import axios from 'axios';
import queryString from 'query-string';
import { PropertyInterface, PropertyGetQueryInterface, searchInterface } from 'interfaces/property';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getProperties = async (
  query?: PropertyGetQueryInterface,
): Promise<PaginatedInterface<PropertyInterface>> => {
  const response = await axios.get('/api/properties', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
export const getPropertyProperties = async (
  query?: PropertyGetQueryInterface,
): Promise<PaginatedInterface<PropertyInterface>> => {
  const response = await axios.get('/api/properties/properties', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
export const getHomeProperties = async (
  query?: PropertyGetQueryInterface,
): Promise<any> => {
  const response = await axios.get('/api/properties/home', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createProperty = async (property: PropertyInterface) => {
  const response = await axios.post('/api/properties', property);
  return response.data;
};

export const updatePropertyById = async (id: string, property: PropertyInterface) => {
  const response = await axios.put(`/api/properties/${id}`, property);
  return response.data;
};

export const getPropertyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/properties/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePropertyById = async (id: string) => {
  const response = await axios.delete(`/api/properties/${id}`);
  return response.data;
};
export const searchProperties = async (query?: searchInterface) => {
  const response = await axios.get(`/api/properties/search${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};