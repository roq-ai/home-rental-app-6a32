import { UserInterface } from 'interfaces/user';
import { PropertyInterface } from 'interfaces/property';
import { GetQueryInterface } from 'interfaces';

export interface BookingInterface {
  id?: string;
  start_date: any;
  end_date: any;
  num_of_guest:string
  num_of_night:string
  total_price:string
  guest_id?: string;
  property_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  property?: PropertyInterface;
  _count?: {};
}

export interface BookingGetQueryInterface extends GetQueryInterface {
  id?: string;
  guest_id?: string;
  property_id?: string;
}
