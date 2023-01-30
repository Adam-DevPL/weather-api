import { Controller, Get, Param } from '@nestjs/common';
import { GetCountryParam } from 'src/get/types/get.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('weather/get')
export class GetController {
  constructor(private fetchDataApi: FetchDataApiService) {}

  @Get('country/:country')
  async getAverageTemperatureForCountry(@Param() countryName: GetCountryParam) {
    const {
      current_weather: { temperature },
    } = await this.fetchDataApi.getDataFromApi(countryName);
    return {
      countryName,
      temperature,
    };
  }
}
