export type Vehicle = {
  _id: string;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
  imageUrl: string;
  status: 'AVAILABLE' | 'RESERVED';
  createdAt: string;
  updatedAt: string;
};

export interface VehicleFiltersResponse {
  types: string[];
  engines: string[];
  sizes: string[];
}

