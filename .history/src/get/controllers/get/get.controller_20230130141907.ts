import { Controller, Get } from '@nestjs/common';

@Controller('weather/get')
export class GetController {
  @Get('country')
  getAverageTemperatureForCountry() {
    return {
      avgTemperature: 10,
      country: 'Spain',
    };
  }
}
