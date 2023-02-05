import { IsAlpha, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetCountryParam {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  country: string;
}

export class GetCityParam {
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

export type GetCountryTempResponse = {
  country: string;
  avgTemperatue: number;
};

export type GetWeatherResponse = {
  city?: string;
  temperature: number;
  weather: string;
};
