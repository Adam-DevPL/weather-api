import { GeoCoordinates } from 'src/weather/types/weather.types';

export type ApiResponse = {
  avgTemperature: number;
  weather: string;
};

export type WeatherResponse = {
  location: string | GeoCoordinates;
  avgTemperature: number;
  weather: string;
};
