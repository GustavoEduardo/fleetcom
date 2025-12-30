import { Vehicle } from "./vehicle.model";

export type Reservation = {
  _id: string;
  userId: string;
  reservedFrom: string;
  reservedUntil: string;
  cancelled: string;
  vehicle: Vehicle;
};

export type NewReservation = {
  userId: string;
  reservedFrom: string;
  reservedUntil: string;
};
