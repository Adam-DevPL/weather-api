import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  FetchDataApiGeoResponse,
  FetchDataApiParams,
} from './types/FetchDataApi.types';

@Injectable()
export class FetchDataApiService {
  private weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  private geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private readonly httpService: HttpService) {}

  public async getDataFromApi(params: FetchDataApiParams) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.weatherUrl, { params }),
    );

    return {
      data,
    };
  }

  public async getGeoLocation(name: string): Promise<FetchDataApiGeoResponse> {
    const params = {
      name,
      count: 1,
    };

    const { data } = await firstValueFrom(
      this.httpService.get(this.geoUrl, { params }),
    );

    if (!data.hasOwnProperty('results')) {
      throw new HttpException('Location not found', HttpStatus.BAD_REQUEST);
    }

    const {
      results: [{ latitude, longitude, country }],
    } = data;

    return {
      latitude,
      longitude,
      location: country,
    };
  }
}
