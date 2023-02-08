import { Controller, Get, Param } from '@nestjs/common';
import { GetService } from 'src/get/services/get/get.service';
import {
  GetWeatherResponse,
  GetLocationParam,
  GetRouteLocationParam,
  GetRouteCountryParam,
  GetRouteCityParam,
} from 'src/get/types/get.types';
import { LocationType } from 'src/prediction/types/prediction.types';

@Controller('weather/get')
export class GetController {
  constructor(private getService: GetService) {}

  @Get('country/:country')
  async getWeatherForCountry(
    @Param() { country }: GetRouteCountryParam,
  ): Promise<GetWeatherResponse> {
    const getRouteLocationParam: GetRouteLocationParam = {
      locationType: LocationType.Country,
      locationParam: country,
    };
    return this.getService.getCurrentWeather(getRouteLocationParam);
  }

  @Get('city/:city')
  async getWeatherForCity(
    @Param() { city }: GetRouteCityParam,
  ): Promise<GetWeatherResponse> {
    const getRouteLocationParam: GetRouteLocationParam = {
      locationType: LocationType.City,
      locationParam: city,
    };
    return this.getService.getCurrentWeather(getRouteLocationParam);
  }

  @Get('location/:lat/:lon')
  async getLocationWeather(
    @Param('lat') lat: number,
    @Param('lon') lon: number,
  ): Promise<GetWeatherResponse> {
    const getRouteLocationParam: GetRouteLocationParam = {
      locationType: LocationType.Geo,
      locationParam: { lat, lon },
    };
    return this.getService.getCurrentWeather(getRouteLocationParam);
  }
}
