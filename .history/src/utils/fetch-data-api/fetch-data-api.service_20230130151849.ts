import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class FetchDataApiService {
  private url = 'https://api.weatherstack.com/current';
  private weatherApi = d203f24abc57cfb788c3f51154affdc2;

  constructor(private readonly httpService: HttpService) {}

  public async getDataFromApi(query: any, type: any) {
    const params = {
      access_ley: this.weatherApi,
      query,
      type,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(this.url, { params }),
    );
    return data;
  }
}
