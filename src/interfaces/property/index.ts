import { BookingInterface } from 'interfaces/booking';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface PropertyInterface {
  id?: string;
  name: string;
  description?: string;
  price :string;
  type: string
  amenities:string[]
  num_of_guest:string
  num_of_beds:string
  num_of_baths:string
  image_urls?:string[]
  location?: string;
  longitude:string
  latitude:string
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  booking?: BookingInterface[];
  company?: CompanyInterface;
  _count?: {
    booking?: number;
  };
}

export interface PropertyGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  location?: string;
  company_id?: string;
}