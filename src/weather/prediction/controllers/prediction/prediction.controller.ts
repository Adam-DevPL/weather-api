import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PredictionService } from 'src/prediction/services/prediction/prediction.service';
import { ForecastResponse } from 'src/prediction/types/prediction.types';
import { ToolsService } from 'src/tools/tools.service';
import {
  CoordinatesInputDates,
  LocationNameInputDates,
  LocationNameInputDay,
  LocationType,
} from 'src/weather/types/weather.types';
import {
  CityDatesRangeParam,
  CityDayParam,
  CountryDatesRangeParam,
  CountryDayParam,
  GeoCoordinatesDatesRangeParam,
} from 'src/Validation/validation.module';

@Controller('weather/prediction')
export class PredictionController {
  constructor(
    private predictionService: PredictionService,
    private toolsService: ToolsService,
  ) {}

  @Get('country/:day/:country')
  getForecastForCountry(
    @Param() { country, day }: CountryDayParam,
  ): Promise<ForecastResponse> {
    const locationNameInputDay: LocationNameInputDay = {
      day,
      locationName: country,
      locationType: LocationType.COUNTRY,
    };

    return this.predictionService.getForecastForSingleDay(locationNameInputDay);
  }
  @Get('city/:day/:city')
  getForecastForCity(
    @Param() { city, day }: CityDayParam,
  ): Promise<ForecastResponse> {
    const locationNameInputDay: LocationNameInputDay = {
      day,
      locationName: city,
      locationType: LocationType.CITY,
    };

    return this.predictionService.getForecastForSingleDay(locationNameInputDay);
  }

  @Get('country/:country/:from/:to')
  getForecastForCountryInDateRange(
    @Param() { country, from, to }: CountryDatesRangeParam,
  ): Promise<ForecastResponse> {
    if (this.toolsService.checkDatesRange(from, to)) {
      throw new HttpException(
        'Invalid dates order. Date "from" is later then "to" date',
        HttpStatus.BAD_REQUEST,
      );
    }
    const locationNameInputDates: LocationNameInputDates = {
      locationType: LocationType.COUNTRY,
      locationName: country,
      from,
      to,
    };

    return this.predictionService.getForecastForCountryOrCityInDateRange(
      locationNameInputDates,
    );
  }

  @Get('city/:city/:from/:to')
  getForecastForCityInDateRange(
    @Param() { city, from, to }: CityDatesRangeParam,
  ): Promise<ForecastResponse> {
    if (this.toolsService.checkDatesRange(from, to)) {
      throw new HttpException(
        'Invalid dates order. Date "from" is later then "to" date',
        HttpStatus.BAD_REQUEST,
      );
    }

    const locationNameInputDates: LocationNameInputDates = {
      locationType: LocationType.CITY,
      locationName: city,
      from,
      to,
    };

    return this.predictionService.getForecastForCountryOrCityInDateRange(
      locationNameInputDates,
    );
  }

  @Get('location/:lat/:lon/:from/:to')
  getForecastForCoordinatesInDateRange(
    @Param() { lat, lon, from, to }: GeoCoordinatesDatesRangeParam,
  ): Promise<ForecastResponse> {
    if (this.toolsService.checkDatesRange(from, to)) {
      throw new HttpException(
        'Invalid dates order. Date "from" is later then "to" date',
        HttpStatus.BAD_REQUEST,
      );
    }
    const coordinatesInputDates: CoordinatesInputDates = {
      lat,
      lon,
      from,
      to,
    };

    return this.predictionService.getForecastForGeoLocationInDateRange(
      coordinatesInputDates,
    );
  }
}
