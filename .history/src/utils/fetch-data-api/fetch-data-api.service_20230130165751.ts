import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchDataApiService {
  private weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  private geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private readonly httpService: HttpService) {}

  public async getDataFromApi(countryName: string) {
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

  public async getGeoLocation(name: string) {
    const params = {
      name,
      count: 1,
    };

    const { data } = await firstValueFrom(
      this.httpService.get(this.geoUrl, { params }),
    );

    console.log(resp);

    const {
      data: {
        results: [{ latitude, longitude }],
      },
    } = resp;

    if (!latitude || !longitude) {
      throw new HttpException('Location not found', HttpStatus.BAD_REQUEST);
    }

    return {
      latitude,
      longitude,
    };
  }
}
