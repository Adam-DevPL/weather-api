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
  LocationType,
  PredictionForecastResponse,
  PredictionRouteLocationDateRangeParams,
  PredictionRouteLocationSingleDayParam,
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
    const predictionRouteCountryDayParams: PredictionRouteLocationSingleDayParam =
      {
        day: day.toISOString().split('T')[0],
        locationName: country,
        locationType: LocationType.Country,
      };

    return this.predictionService.getForecastForSingleDay(
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
    const predictionRouteCityDayParams: PredictionRouteLocationSingleDayParam =
      {
        day: day.toISOString().split('T')[0],
        locationName: city,
        locationType: LocationType.City,
      };

    return this.predictionService.getForecastForSingleDay(
      predictionRouteCityDayParams,
    );
  }

  @Get('country/:country/:from/:to')
  getForecastForCountryInDateRange(
    @DateParam('from') from: Date,
    @DateParam('to') to: Date,
    @Param('country') country: string,
  ) {
    if (!from || !to) {
      throw new HttpException(`Invalid date`, HttpStatus.BAD_REQUEST);
    }

    const predictionRouteLocationDateRangeParams: PredictionRouteLocationDateRangeParams =
      {
        locationType: LocationType.Country,
        locationParam: country,
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      };

    return this.predictionService.getForecastForLocationInDateRange(
      predictionRouteLocationDateRangeParams,
    );
  }

  @Get('city/:city/:from/:to')
  getForecastForCityInDateRange(
    @DateParam('from') from: Date,
    @DateParam('to') to: Date,
    @Param('city') city: string,
  ) {
    if (!from || !to) {
      throw new HttpException(`Invalid date`, HttpStatus.BAD_REQUEST);
    }

    const predictionRouteLocationDateRangeParams: PredictionRouteLocationDateRangeParams =
      {
        locationType: LocationType.City,
        locationParam: city,
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      };

    return this.predictionService.getForecastForLocationInDateRange(
      predictionRouteLocationDateRangeParams,
    );
  }

  @Get('location/:lat/:lon/:from/:to')
  getForecastForCoordinatesInDateRange(
    @DateParam('from') from: Date,
    @DateParam('to') to: Date,
    @Param('lat') lat: number,
    @Param('lon') lon: number,
  ) {
    if (!from || !to) {
      throw new HttpException(`Invalid date`, HttpStatus.BAD_REQUEST);
    }

    const predictionRouteLocationDateRangeParams: PredictionRouteLocationDateRangeParams =
      {
        locationType: LocationType.Geo,
        locationParam: { lat, lon },
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      };

    return this.predictionService.getForecastForLocationInDateRange(
      predictionRouteLocationDateRangeParams,
    );
  }
}
