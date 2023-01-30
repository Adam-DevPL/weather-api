import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  GetCountryParam,
  GetCountryTempResponse,
} from 'src/get/types/get.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('weather/get')
export class GetController {
  constructor(private fetchDataApi: FetchDataApiService) {}

  @Get('country/:countryName')
  async getAverageTemperatureForCountry(
    @Param() { countryName }: GetCountryParam,
  ): GetCountryTempResponse {
    const {
      data: {
        current_weather: { temperature },
      },
      country,
    } = await this.fetchDataApi.getDataFromApi(countryName);

    if (country.toLowerCase() !== countryName.toLowerCase()) {
      throw new HttpException(
        `It is not a country: ${countryName}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      country,
      avgTemperatue: temperature,
    };
  }
}
