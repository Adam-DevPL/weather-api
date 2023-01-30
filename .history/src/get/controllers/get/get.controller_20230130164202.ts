import { Controller, Get, Param } from '@nestjs/common';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('weather/get')
export class GetController {
  constructor(private fetchDataApi: FetchDataApiService) {}

  @Get('country/:country')
  async getAverageTemperatureForCountry(@Param('country') countryName: string) {
    console.log(countryName);
    // console.log(await this.fetchDataApi.getDataFromApi(countryName));
    await this.fetchDataApi.getGeoLocation('Poland');

    return 'module_get';
  }
}
