import { Controller, Get, Param } from '@nestjs/common';
import { GetService } from 'src/get/services/get/get.service';
import {
  GetRouteCountryParam,
  GetRouteCityParam,
  LocationNameParam,
  CoordinatesParam,
  WeatherResponse,
  GeoCoordinatesParam,
} from 'src/get/types/get.types';
import { LocationType } from 'src/prediction/types/prediction.types';

@Controller('weather/get')
export class GetController {
  constructor(private getService: GetService) {}
  Z;

  @Get('country/:country')
  async getWeatherForCountry(
    @Param() { country }: GetRouteCountryParam,
  ): Promise<WeatherResponse> {
    const locationNameParam: LocationNameParam = {
      locationType: LocationType.Country,
      locationName: country,
    };
    return this.getService.getCurrentWeatherWithoutCoordinates(
      locationNameParam,
    );
  }

  @Get('city/:city')
  async getWeatherForCity(
    @Param() { city }: GetRouteCityParam,
  ): Promise<WeatherResponse> {
    const locationNameParam: LocationNameParam = {
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
    const coordinatesParam: CoordinatesParam = {
      lat,
      lon,
    };
    return this.getService.getCurrentWeatherWithCoordinates(coordinatesParam);
  }
}
