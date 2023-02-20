import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';
import {
  CoordinatesException,
  InternalServerException,
  LocationException,
} from 'src/filters/exceptions/exceptions';
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
        throw new CoordinatesException('Invalid coordinates');
      }

      return {
        data,
      };
    } catch (error) {
      if (error instanceof CoordinatesException) {
        throw new CoordinatesException(error.message);
      }
      throw new InternalServerException(error.message);
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
        throw new LocationException('Location not found');
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
      if (error instanceof LocationException) {
        throw new LocationException(error.message);
      }
      throw new InternalServerException(error.message);
    }
  }
}
