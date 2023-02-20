import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';
import { FetchDataApiException } from 'src/filters/exceptions/fetch-data-api.exception';
import { LocationType } from 'src/weather/types/weather.types';
import {
  FetchDataApiGeoResponse,
  FetchDataApiParams,
} from './types/FetchDataApi.types';

@Injectable()
export class FetchDataApiService {
  private readonly weatherUrl: string;
  private readonly geoUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.weatherUrl = this.configService.get<string>('WEATHER_URL');
    this.geoUrl = this.configService.get<string>('GEO_URL');
  }

  public async getDataFromApi(params: FetchDataApiParams) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.weatherUrl, { params }),
      );

      if (data.error) {
        throw new FetchDataApiException('Invalid coordinates');
      }

      return {
        data,
      };
    } catch (error) {
      throw new FetchDataApiException(error.message);
    }
  }

  public async getGeoLocation(name: string): Promise<FetchDataApiGeoResponse> {
    try {
      const params = {
        name,
        count: 1,
      };

      const { data } = await firstValueFrom(
        this.httpService.get(this.geoUrl, { params }),
      );

      if (!data.hasOwnProperty('results')) {
        throw new FetchDataApiException('Location not found');
      }

      const {
        results: [{ latitude, longitude, country }],
      } = data;

      return {
        latitude,
        longitude,
        location:
          country.toLowerCase() === name.toLowerCase()
            ? LocationType.COUNTRY
            : LocationType.CITY,
      };
    } catch (error) {
      throw new FetchDataApiException(error.message);
    }
  }
}
