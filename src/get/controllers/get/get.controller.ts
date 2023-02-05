import { Controller, Get, Param } from '@nestjs/common';
import { GetService } from 'src/get/services/get/get.service';
import {
  GetCityParam,
  GetWeatherResponse,
  GetCountryParam,
  GetCountryTempResponse,
  GetLocationParam,
} from 'src/get/types/get.types';

@Controller('weather/get')
export class GetController {
  constructor(private getService: GetService) {}

  @Get('country/:country')
  async getAverageTemperatureForCountry(
    @Param() getCountryParam: GetCountryParam,
  ): Promise<GetCountryTempResponse> {
    return this.getService.getCountryAvgTemp(getCountryParam);
  }

  @Get('city/:city')
  async getWeatherForCity(
    @Param() getCityParam: GetCityParam,
  ): Promise<GetWeatherResponse> {
    return this.getService.getCityWeather(getCityParam);
  }

  @Get('location/:lat/:lon')
  async getLocationWeather(
    @Param() getLocationParam: GetLocationParam,
  ): Promise<GetWeatherResponse> {
    return this.getService.getLocationWeather(getLocationParam);
  }
}
