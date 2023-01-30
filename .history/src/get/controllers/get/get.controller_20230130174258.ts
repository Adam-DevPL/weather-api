import { Controller, Get, Param } from '@nestjs/common';
import { GetCountryParam } from 'src/get/types/get.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('weather/get')
export class GetController {
  constructor(private fetchDataApi: FetchDataApiService) {}

  @Get('country/:country')
  async getAverageTemperatureForCountry(@Param() { countryName }: GetCountryParam) {
    const {
      data: {
        current_weather: { temperature },
      },
      country,
    } = await this.fetchDataApi.getDataFromApi(countryName);
    return {
      country,
      temperature,
    };
  }
}
