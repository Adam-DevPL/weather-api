import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';
import { LocationType } from 'src/prediction/types/prediction.types';
import {
  FetchDataApiGeoResponse,
  FetchDataApiParams,
} from './types/FetchDataApi.types';

@Injectable()
export class FetchDataApiService {
  private readonly weatherUrl;
  private readonly geoUrl;

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
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: 'Invalid coordinates' },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data,
      };
    } catch ({ response }) {
      throw new HttpException(
        {
          status:
            response.status === 404
              ? HttpStatus.INTERNAL_SERVER_ERROR
              : HttpStatus.BAD_REQUEST,
          error:
            response.status === 404
              ? 'Internal server error'
              : response.message,
        },
        response.status === 404
          ? HttpStatus.INTERNAL_SERVER_ERROR
          : HttpStatus.BAD_REQUEST,
        {
          cause: response,
        },
      );
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
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: 'Location not found' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const {
        results: [{ latitude, longitude, country }],
      } = data;

      return {
        latitude,
        longitude,
        location:
          country.toLowerCase() === name.toLowerCase()
            ? LocationType.Country
            : LocationType.City,
      };
    } catch ({ response }) {
      throw new HttpException(
        {
          status:
            response.status === 404
              ? HttpStatus.INTERNAL_SERVER_ERROR
              : HttpStatus.BAD_REQUEST,
          error:
            response.status === 404
              ? 'Internal server error'
              : response.message,
        },
        response.status === 404
          ? HttpStatus.INTERNAL_SERVER_ERROR
          : HttpStatus.BAD_REQUEST,
        {
          cause: response,
        },
      );
    }
  }
}
