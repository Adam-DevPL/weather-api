import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PredictionForecastResponse,
  PredictionRouteCountryDayParams,
} from 'src/prediction/types/prediction.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/utils/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/utils/tools/tools.service';

@Injectable()
export class PredictionService {
  constructor(
    private fetchDataApi: FetchDataApiService,
    private tools: ToolsService,
  ) {}

  public async getForecastForCountry({
    day,
    country,
  }: PredictionRouteCountryDayParams): Promise<PredictionForecastResponse> {
    const { latitude, longitude, location } =
      await this.fetchDataApi.getGeoLocation(country);

    if (location.toLowerCase() !== country.toLowerCase()) {
      throw new HttpException(
        `It is not a country: ${country}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const fetchDataApiParams: FetchDataApiParams = {
      latitude,
      longitude,
      start_date: day,
      end_date: day,
      hourly: 'temperature_2m,weathercode',
    };

    const {
      data: {
        hourly: { temperature_2m, weathercode },
      },
    } = await this.fetchDataApi.getDataFromApi(fetchDataApiParams);

    const avgTemperature: string = (
      temperature_2m.reduce((a: number, b: number) => a + b, 0) /
      temperature_2m.length
    ).toFixed(1);

    const weatherCode = this.tools.getWeatherCode(
      Number(this.tools.mostFrequent(weathercode)),
    );

    return {
      location: country,
      day: day,
      avgTemperature,
      weather: weatherCode,
    };
  }
}
