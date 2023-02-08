import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  GetWeatherResponse,
  GetRouteLocationParam,
} from 'src/get/types/get.types';
import { LocationType } from 'src/prediction/types/prediction.types';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class GetService {
  constructor(
    private fetchDataApi: FetchDataApiService,
    private tools: ToolsService,
  ) {}

  public async getCurrentWeather({
    locationType,
    locationParam,
  }: GetRouteLocationParam): Promise<GetWeatherResponse> {
    let lon: number;
    let lat: number;

    if (locationType !== LocationType.Geo) {
      const { latitude, longitude, location } =
        await this.fetchDataApi.getGeoLocation(locationParam);

      if (locationType !== location) {
        throw new HttpException(
          `It is not a ${LocationType[locationType]}: ${locationParam}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      lat = latitude;
      lon = longitude;
    } else {
      lat = locationParam.lat;
      lon = locationParam.lon;
    }

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
      location: locationParam,
      avgTemperature: temperature,
      weather: this.tools.getWeatherCode(weathercode),
    };
  }
}
