import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchDataApiService {
  private weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  private geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private weatherApi = 'd203f24abc57cfb788c3f51154affdc2';

  constructor(private readonly httpService: HttpService) {}

  public async getDataFromApi(countryName: string) {
    const { latitude, longitude } = await this.getGeoLocation(countryName);
    const params = {
      latitude,
      longitude,
      current_weather: true,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(this.weatherApi, { params }),
    );
    return data;
  }

  public async getGeoLocation(name: string) {
    const params = {
      name,
      count: 1,
    };

    const {
      data: {
        results: [{ latitude, longitude }],
      },
    } = await firstValueFrom(this.httpService.get(this.geoUrl, { params }));
    return {
      latitude,
      longitude,
    };
  }
}
