import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  GetWeatherResponse,
  GetCountryTempResponse,
  GetCountryParam,
  GetCityParam,
  GetLocationParam,
} from 'src/get/types/get.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/utils/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/utils/tools/tools.service';

@Injectable()
export class GetService {
  constructor(
    private fetchDataApi: FetchDataApiService,
    private tools: ToolsService,
  ) {}

  public async getCountryAvgTemp({
    country,
  }: GetCountryParam): Promise<GetCountryTempResponse> {
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
      current_weather: true,
    };

    const {
      data: {
        current_weather: { temperature },
      },
    } = await this.fetchDataApi.getDataFromApi(fetchDataApiParams);

    return {
      country,
      avgTemperatue: temperature,
    };
  }

  public async getCityWeather({
    city,
  }: GetCityParam): Promise<GetWeatherResponse> {
    const { latitude, longitude, location } =
      await this.fetchDataApi.getGeoLocation(city);

    if (location.toLowerCase() === city.toLowerCase()) {
      throw new HttpException(
        `It is not a city: ${city}`,
        HttpStatus.BAD_REQUEST,
      );
    }

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
      city: city,
      temperature,
      weather: this.tools.getWeatherCode(weathercode),
    };
  }

  public async getLocationWeather({
    lat,
    lon,
  }: GetLocationParam): Promise<GetWeatherResponse> {
    const fetchDataApiParams: FetchDataApiParams = {
      latitude: lat,
      longitude: lon,
      current_weather: true,
    };

    const {
      data: {
        current_weather: { temperature, weathercode },
      },
    } = await this.fetchDataApi.getDataFromApi(fetchDataApiParams);

    return {
      temperature,
      weather: this.tools.getWeatherCode(weathercode),
    };
  }
}
