import { Controller, Get, Param } from '@nestjs/common';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Controller('get')
export class GetController {
  constructor(private fetchDataApi: FetchDataApiService) {}

  @Get('/country')
  test() {
    return 'success';
  }

  @Get('country/:country')
  getAverageTemperatureForCountry(@Param('country') countryName: string) {
    console.log(countryName);
    return this.fetchDataApi.getDataFromApi(countryName, 'country');
  }
}
