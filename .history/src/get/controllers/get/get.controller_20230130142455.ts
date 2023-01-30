import { Controller, Get, Param } from '@nestjs/common';

@Controller('weather/get')
export class GetController {
  @Get('country/:country')
  getAverageTemperatureForCountry(@Param('country') countryName: string) {
    console.log(countryName);
  }
}
