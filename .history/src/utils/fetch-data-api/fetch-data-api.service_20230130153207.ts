import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchDataApiService {
  private url = 'http://api.weatherstack.com/current';
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
}
