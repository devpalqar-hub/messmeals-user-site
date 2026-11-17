export type GeoLocation = {
  id: number;
  country: string;
  zipcode: string;
  placeName: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
};

export type GeoLocationResponse = {
  data: GeoLocation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
