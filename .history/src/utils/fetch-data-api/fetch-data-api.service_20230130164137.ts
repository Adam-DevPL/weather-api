import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchDataApiService {
  private url = 'http://api.weatherstack.com/current';
  private geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private weatherApi = 'd203f24abc57cfb788c3f51154affdc2';

  constructor(private readonly httpService: HttpService) {}

  public async getDataFromApi(countryName: string) {
    const params = {
      access_key: this.weatherApi,
      query: countryName,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(this.url, { params }),
    );
    return data;
  }

  public async getGeoLocation(name: string) {
    const params = {
      name,
      count: 1,
    };

    const resp = await firstValueFrom(
      this.httpService.get(this.geoUrl, { params }),
    );
    console.log(resp);
    return 'geo success';
  }
}
