import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ApiResponsePredictRoute,
  ForecastResponse,
  OpenModelResponse,
  WeatherInfo,
} from 'src/prediction/types/prediction.types';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/tools/tools.service';
import {
  CoordinatesInputDates,
  LocationNameInputDates,
  LocationNameInputDay,
  LocationType,
} from 'src/types/app.types';

@Injectable()
export class PredictionService {
  constructor(
    private fetchDataApi: FetchDataApiService,
    private tools: ToolsService,
  ) {}

  public async getForecastForSingleDay({
    day,
    locationName,
    locationType,
  }: LocationNameInputDay): Promise<ForecastResponse> {
    const { latitude, longitude, location } =
      await this.fetchDataApi.getGeoLocation(locationName);

    if (locationType !== location) {
      throw new HttpException(
        `It is not a ${LocationType[locationType]}: ${locationName}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { temperatureArr, weatherCodeArr }: ApiResponsePredictRoute =
      await this.getDataApi(latitude, longitude, day, day);

    const avgTemperature: string = this.tools
      .getAverage(temperatureArr)
      .toFixed(1);

    const weatherCode: string = this.tools.getWeatherCode(
      Number(this.tools.mostFrequent(weatherCodeArr)),
    );

    return {
      location: locationName,
      weatherInfo: { day: day, avgTemperature, weather: weatherCode },
    } as ForecastResponse;
  }

  public async getForecastForCountryOrCityInDateRange({
    locationType,
    locationName,
    from,
    to,
  }: LocationNameInputDates): Promise<ForecastResponse> {
    const { latitude, longitude, location } =
      await this.fetchDataApi.getGeoLocation(locationName);

    if (locationType !== location) {
      throw new HttpException(
        `It is not a ${LocationType[locationType]}: ${locationName}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { timeArr, temperatureArr, weatherCodeArr }: ApiResponsePredictRoute =
      await this.getDataApi(latitude, longitude, from, to);

    const weatherInfo: WeatherInfo[] = this.tools.convertApiData(
      timeArr,
      temperatureArr,
      weatherCodeArr,
    );

    return {
      location: locationName,
      weatherInfo,
    } as ForecastResponse;
  }

  public async getForecastForGeoLocationInDateRange({
    lat,
    lon,
    from,
    to,
  }: CoordinatesInputDates) {
    const { timeArr, temperatureArr, weatherCodeArr }: ApiResponsePredictRoute =
      await this.getDataApi(lat, lon, from, to);

    const weatherInfo: WeatherInfo[] = this.tools.convertApiData(
      timeArr,
      temperatureArr,
      weatherCodeArr,
    );

    return {
      location: {
        latitude: lat,
        longitude: lon,
      },
      weatherInfo,
    } as ForecastResponse;
  }

  private async getDataApi(
    latitude: number,
    longitude: number,
    start_date: string,
    end_date: string,
  ): Promise<ApiResponsePredictRoute> {
    const fetchDataApiParams: FetchDataApiParams = {
      latitude,
      longitude,
      start_date,
      end_date,
      hourly: 'temperature_2m,weathercode',
    };

    const {
      data: {
        hourly: { time, temperature_2m, weathercode },
      },
    }: OpenModelResponse = await this.fetchDataApi.getDataFromApi(
      fetchDataApiParams,
    );

    return {
      timeArr: time,
      temperatureArr: temperature_2m,
      weatherCodeArr: weathercode,
    } as ApiResponsePredictRoute;
  }
}
