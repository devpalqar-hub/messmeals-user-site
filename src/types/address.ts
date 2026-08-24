export interface AddressPayload {
  name: string;
  street: string;
  townOrcity: string;
  country: string;
  postcode: string;
  landmark: string;
  latitudeLogitude: string;
  phone: string;
  email: string;
  locationLink?: string;
}

export interface Address extends AddressPayload {
  id: string;
  profileId: string;
}
