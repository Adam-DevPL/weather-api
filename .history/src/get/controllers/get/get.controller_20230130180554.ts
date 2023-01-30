import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { GetService } from 'src/get/services/get/get.service';
import {
  GetCountryParam,
  GetCountryTempResponse,
} from 'src/get/types/get.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('weather/get')
export class GetController {
  constructor(private getService: GetService) {}

  @Get('country/:countryName')
  async getAverageTemperatureForCountry(
    @Param() { countryName }: GetCountryParam,
  ): Promise<GetCountryTempResponse> {
    return this.getService(countryName);
  }
}
