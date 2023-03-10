import { LocationType } from 'src/weather/types/weather.types';

export type FetchDataApiParams = {
  latitude: number;
  longitude: number;
  start_date?: string;
  end_date?: string;
  current_weather?: true;
  hourly?: 'temperature_2m,weathercode';
};

export type FetchDataApiGeoResponse = {
  latitude: number;
  longitude: number;
  location: LocationType;
};
