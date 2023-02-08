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

export class GetLocationParam {
  @IsNumber()
  lat: number;
  @IsNumber()
  lon: number;
}

export type GetRouteLocationParam =
  | {
      locationType: LocationType.Geo;
      locationParam: GeoCoordinates;
    }
  | {
      locationType: LocationType.City | LocationType.Country;
      locationParam: string;
    };

export type GetWeatherResponse = {
  location: string | GeoCoordinates;
  avgTemperature: number;
  weather: string;
};
