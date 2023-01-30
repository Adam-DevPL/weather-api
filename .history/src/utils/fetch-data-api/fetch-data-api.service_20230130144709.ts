import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchDataApiService {
  private url = 'https://api.weatherstack.com/current';
  private weatherApi = 'd203f24abc57cfb788c3f51154affdc2';

  constructor(private readonly httpService: HttpService) {}

  public getDataFromApi(query: any, type: any): any {
    const params = {
      access_ley: this.weatherApi,
      query,
      type,
    };
    return this.httpService.get(this.url);
  }
}
