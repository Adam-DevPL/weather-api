import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PredictionService } from 'src/prediction/services/prediction/prediction.service';
import { ForecastResponse } from 'src/prediction/types/prediction.types';
import {
  CoordinatesInputDates,
  LocationNameInputDates,
  LocationNameInputDay,
  LocationType,
} from 'src/types/app.types';
import {
  CityDatesRangeParam,
  CityDayParam,
  CountryDatesRangeParam,
  CountryDayParam,
  GeoCoordinatesDatesRangeParam,
} from 'src/Validation/ValidationClass';

@Controller('weather/prediction')
export class PredictionController {
  constructor(private predictionService: PredictionService) {}

  @Get('country/:day/:country')
  getForecastForCountry(
    @Param() { country, day }: CountryDayParam,
  ): Promise<ForecastResponse> {
    const locationNameInputDay: LocationNameInputDay = {
      day,
      locationName: country,
      locationType: LocationType.Country,
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
      locationType: LocationType.City,
    };

    return this.predictionService.getForecastForSingleDay(locationNameInputDay);
  }

  @Get('country/:country/:from/:to')
  getForecastForCountryInDateRange(
    @Param() { country, from, to }: CountryDatesRangeParam,
  ): Promise<ForecastResponse> {
    const locationNameInputDates: LocationNameInputDates = {
      locationType: LocationType.Country,
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
    if (!from || !to) {
      throw new HttpException(`Invalid date`, HttpStatus.BAD_REQUEST);
    }

    const locationNameInputDates: LocationNameInputDates = {
      locationType: LocationType.City,
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
