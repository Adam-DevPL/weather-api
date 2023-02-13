import { Controller, Get, Param } from '@nestjs/common';
import { GetService } from 'src/get/services/get.service';
import { WeatherResponse } from 'src/get/types/get.types';
import {
  CoordinatesInput,
  LocationNameInput,
  LocationType,
} from 'src/types/app.types';
import {
  CityParam,
  CountryParam,
  GeoCoordinatesParam,
} from 'src/Validation/ValidationClass';

@Controller('weather/get')
export class GetController {
  constructor(private getService: GetService) {}
  Z;

  @Get('country/:country')
  async getWeatherForCountry(
    @Param() { country }: CountryParam,
  ): Promise<WeatherResponse> {
    const locationNameParam: LocationNameInput = {
      locationType: LocationType.Country,
      locationName: country,
    };
    return this.getService.getCurrentWeatherWithoutCoordinates(
      locationNameParam,
    );
  }

  @Get('city/:city')
  async getWeatherForCity(
    @Param() { city }: CityParam,
  ): Promise<WeatherResponse> {
    const locationNameParam: LocationNameInput = {
      locationType: LocationType.City,
      locationName: city,
    };
    return this.getService.getCurrentWeatherWithoutCoordinates(
      locationNameParam,
    );
  }

  @Get('location/:lat/:lon')
  async getLocationWeather(
    @Param() { lat, lon }: GeoCoordinatesParam,
  ): Promise<WeatherResponse> {
    const coordinatesParam: CoordinatesInput = {
      lat,
      lon,
    };
    return this.getService.getCurrentWeatherWithCoordinates(coordinatesParam);
  }
}
