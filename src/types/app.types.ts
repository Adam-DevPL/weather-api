type DateInput = {
  day: string;
};
type DatesRange = {
  from: string;
  to: string;
};

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

export type LocationNameInput = {
  locationType: LocationType.City | LocationType.Country;
  locationName: string;
};

export type LocationNameInputDay = LocationNameInput & DateInput;
export type LocationNameInputDates = LocationNameInput & DatesRange;

export type CoordinatesInput = {
  lat: number;
  lon: number;
};

export type CoordinatesInputDates = CoordinatesInput & DatesRange;

export enum LocationType {
  City,
  Country,
  Geo,
}
