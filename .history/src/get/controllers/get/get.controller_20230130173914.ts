import { Controller, Get, Param } from '@nestjs/common';
import { GetCountryParam } from 'src/get/types/get.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('weather/get')
export class GetController {
  constructor(private fetchDataApi: FetchDataApiService) {}

  @Get('country/:country')
  async getAverageTemperatureForCountry(@Param() { country }: GetCountryParam) {
    const {
      current_weather: { temperature },
    } = await this.fetchDataApi.getDataFromApi(country);
    return {
      country,
      temperature,
    };
  }
}
