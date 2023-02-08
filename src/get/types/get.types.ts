import { Type } from 'class-transformer';
import { IsAlpha, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  GeoCoordinates,
  LocationType,
} from 'src/prediction/types/prediction.types';

export class GetRouteCountryParam {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  country: string;
}

export class GetRouteCityParam {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  city: string;
}

export class GeoCoordinatesParam {
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lon: number;
}

export type LocationNameParam = {
  locationType: LocationType.City | LocationType.Country;
  locationName: string;
};

export type CoordinatesParam = {
  lat: number;
  lon: number;
};

export type ApiResponse = {
  avgTemperature: number;
  weather: string;
};

export type WeatherResponse = {
  location: string | GeoCoordinates;
  avgTemperature: number;
  weather: string;
};
