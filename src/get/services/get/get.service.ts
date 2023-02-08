import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  WeatherResponse,
  LocationNameParam,
  CoordinatesParam,
  ApiResponse,
} from 'src/get/types/get.types';
import { LocationType } from 'src/prediction/types/prediction.types';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class GetService {
  constructor(
    private readonly fetchDataApi: FetchDataApiService,
    private readonly tools: ToolsService,
  ) {}

  public async getCurrentWeatherWithoutCoordinates({
    locationType,
    locationName,
  }: LocationNameParam): Promise<WeatherResponse> {
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
    };
  }

  public async getCurrentWeatherWithCoordinates({
    lat,
    lon,
  }: CoordinatesParam): Promise<WeatherResponse> {
    const { avgTemperature, weather }: ApiResponse = await this.getApiData(
      lat,
      lon,
    );

    return {
      location: { lat, lon },
      avgTemperature,
      weather,
    };
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
    };
  }
}
