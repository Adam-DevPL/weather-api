import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Injectable()
export class GetService {
  constructor(private fetchDataApi: FetchDataApiService) {}

  public async getCountryAvgTemp(countryName: string) {
    const {
      data: {
        current_weather: { temperature },
      },
      country,
    } = await this.fetchDataApi.getDataFromApi(countryName);

    if (country.toLowerCase() !== countryName.toLowerCase()) {
      throw new HttpException(
        `It is not a country: ${countryName}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      country,
      avgTemperatue: temperature,
    };
  }
}
