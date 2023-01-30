import { Controller, Get, Param } from '@nestjs/common';
import { GetService } from 'src/get/services/get/get.service';
import {
  GetCountryParam,
  GetCountryTempResponse,
} from 'src/get/types/get.types';

@Controller('weather/get')
export class GetController {
  constructor(private getService: GetService) {}

  @Get('country/:countryName')
  async getAverageTemperatureForCountry(
    @Param() { countryName }: GetCountryParam,
  ): Promise<GetCountryTempResponse> {
    return this.getService.getCountryAvgTemp(countryName);
  }
}
