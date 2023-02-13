import { GeoCoordinates } from 'src/types/app.types';

export type ApiResponse = {
  avgTemperature: number;
  weather: string;
};

export type WeatherResponse = {
  location: string | GeoCoordinates;
  avgTemperature: number;
  weather: string;
};
