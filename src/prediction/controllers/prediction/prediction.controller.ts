import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DateParam } from 'src/decorators/DataDecorator';
import { PredictionService } from 'src/prediction/services/prediction/prediction.service';
import { PredictionRouteCountryDayParams } from 'src/prediction/types/prediction.types';

@Controller('weather/prediction')
export class PredictionController {
  constructor(private predictionService: PredictionService) {}
  @Get(':day/:country')
  getForecastForCountry(
    @DateParam('day') day: Date,
    @Param('country') country: string,
  ) {
    if (!day) {
      throw new HttpException(`Invalid date`, HttpStatus.BAD_REQUEST);
    }
    const predictionRouteCountryDayParams: PredictionRouteCountryDayParams = {
      day: day.toISOString().split('T')[0],
      country,
    };
    return this.predictionService.getForecastForCountry(
      predictionRouteCountryDayParams,
    );
  }
}
