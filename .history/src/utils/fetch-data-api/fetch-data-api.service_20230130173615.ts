import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetCountryParam } from 'src/get/types/get.types';

@Injectable()
export class FetchDataApiService {
  private weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  private geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private readonly httpService: HttpService) {}

  public async getDataFromApi(countryName: GetCountryParam) {
    const { latitude, longitude } = await this.getGeoLocation(countryName);
    const params = {
      latitude,
      longitude,
      current_weather: true,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(this.weatherUrl, { params }),
    );
    return data;
  }

  private async getGeoLocation(name: GetCountryParam) {
    const params = {
      name,
      count: 1,
    };

    const { data } = await firstValueFrom(
      this.httpService.get(this.geoUrl, { params }),
    );

    console.log(data);

    if (!data.hasOwnProperty('results')) {
      throw new HttpException('Location not found', HttpStatus.BAD_REQUEST);
    }

    const {
      results: [{ latitude, longitude, country }],
    } = data;

    return {
      latitude,
      longitude,
      country,
    };
  }
}
