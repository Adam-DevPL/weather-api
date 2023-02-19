import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WeatherResponse, ApiResponse } from 'src/weather/types/get.types';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/tools/tools.service';
import {
  CoordinatesInput,
  LocationNameInput,
  LocationType,
} from 'src/weather/types/weather.types';

@Injectable()
export class GetService {
  constructor(
    private readonly fetchDataApi: FetchDataApiService,
    private readonly tools: ToolsService,
  ) {}

  public async getCurrentWeatherWithoutCoordinates({
    locationType,
    locationName,
  }: LocationNameInput): Promise<WeatherResponse> {
    const { latitude, longitude, location } =
      await this.fetchDataApi.getGeoLocation(locationName);

    if (locationType !== location) {
      throw new HttpException(
        `It is not a ${LocationType[locationType]}: ${locationName}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { avgTemperature, weather }: ApiResponse = await this.getApiData(
      latitude,
      longitude,
    );

    return {
      location: locationName,
      avgTemperature,
      weather,
    } as WeatherResponse;
  }

  public async getCurrentWeatherWithCoordinates({
    lat,
    lon,
  }: CoordinatesInput): Promise<WeatherResponse> {
    const { avgTemperature, weather }: ApiResponse = await this.getApiData(
      lat,
      lon,
    );

    return {
      location: { latitude: lat, longitude: lon },
      avgTemperature,
      weather,
    } as WeatherResponse;
  }

  private async getApiData(
    latitude: number,
    longitude: number,
  ): Promise<ApiResponse> {
    const fetchDataApiParams: FetchDataApiParams = {
      latitude,
      longitude,
      current_weather: true,
    };

    const {
      data: {
        current_weather: { temperature, weathercode },
      },
    } = await this.fetchDataApi.getDataFromApi(fetchDataApiParams);

    return {
      avgTemperature: temperature,
      weather: this.tools.getWeatherCode(weathercode),
    } as ApiResponse;
  }
}
