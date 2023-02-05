import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DateParam } from 'src/decorators/DataDecorator';
import { PredictionService } from 'src/prediction/services/prediction/prediction.service';
import {
  PredictionForecastResponse,
  PredictionRouteCityDayParams,
  PredictionRouteCountryDayParams,
} from 'src/prediction/types/prediction.types';

@Controller('weather/prediction')
export class PredictionController {
  constructor(private predictionService: PredictionService) {}

  @Get('country/:day/:country')
  getForecastForCountry(
    @DateParam('day') day: Date,
    @Param('country') country: string,
  ): Promise<PredictionForecastResponse> {
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
  @Get('city/:day/:city')
  getForecastForCity(
    @DateParam('day') day: Date,
    @Param('city') city: string,
  ): Promise<PredictionForecastResponse> {
    if (!day) {
      throw new HttpException(`Invalid date`, HttpStatus.BAD_REQUEST);
    }
    const predictionRouteCityDayParams: PredictionRouteCityDayParams = {
      day: day.toISOString().split('T')[0],
      city,
    };

    return this.predictionService.getForecastForCity(
      predictionRouteCityDayParams,
    );
  }
}
