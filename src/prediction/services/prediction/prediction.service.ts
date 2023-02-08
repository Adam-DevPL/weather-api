import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  LocationType,
  OpenModelResponse,
  PredictionDataObject,
  PredictionForecastResponse,
  PredictionRouteLocationDateRangeParams,
  PredictionRouteLocationSingleDayParam,
  WeatherInfo,
} from 'src/prediction/types/prediction.types';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';
import { FetchDataApiParams } from 'src/utils/fetch-data-api/types/FetchDataApi.types';
import { ToolsService } from 'src/utils/tools/tools.service';

@Injectable()
export class PredictionService {
  constructor(
    private fetchDataApi: FetchDataApiService,
    private tools: ToolsService,
  ) {}

  public async getForecastForSingleDay({
    day,
    locationName,
    locationType,
  }: PredictionRouteLocationSingleDayParam): Promise<PredictionForecastResponse> {
    const { latitude, longitude, location } =
      await this.fetchDataApi.getGeoLocation(locationName);

    if (locationType !== location) {
      throw new HttpException(
        `It is not a ${LocationType[locationType]}: ${locationName}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const fetchDataApiParams: FetchDataApiParams = {
      latitude,
      longitude,
      start_date: day,
      end_date: day,
      hourly: 'temperature_2m,weathercode',
    };

    const {
      data: {
        hourly: { temperature_2m, weathercode },
      },
    } = await this.fetchDataApi.getDataFromApi(fetchDataApiParams);

    const avgTemperature: string = (
      temperature_2m.reduce((a: number, b: number) => a + b, 0) /
      temperature_2m.length
    ).toFixed(1);

    const weatherCode = this.tools.getWeatherCode(
      Number(this.tools.mostFrequent(weathercode)),
    );

    return {
      location: locationName,
      weatherInfo: { day: day, avgTemperature, weather: weatherCode },
    };
  }

  public async getForecastForLocationInDateRange({
    locationType,
    locationParam,
    from,
    to,
  }: PredictionRouteLocationDateRangeParams) {
    let lat: number;
    let lon: number;

    if (locationType !== LocationType.Geo) {
      const { latitude, longitude, location } =
        await this.fetchDataApi.getGeoLocation(locationParam);

      if (locationType !== location) {
        throw new HttpException(
          `It is not a ${LocationType[locationType]}: ${locationParam}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      lat = latitude;
      lon = longitude;
    } else {
      lat = locationParam.lat;
      lon = locationParam.lon;
    }

    const fetchDataApiParams: FetchDataApiParams = {
      latitude: lat,
      longitude: lon,
      start_date: from,
      end_date: to,
      hourly: 'temperature_2m,weathercode',
    };

    const {
      data: {
        hourly: { time, temperature_2m, weathercode },
      },
    }: OpenModelResponse = await this.fetchDataApi.getDataFromApi(
      fetchDataApiParams,
    );

    const outputArr = time.map((element, index) => {
      const tmp: PredictionDataObject = {
        time: element.slice(0, element.indexOf('T')),
        temperature: temperature_2m[index],
        weatherCode: weathercode[index],
      };
      return tmp;
    });

    const grouped: Array<WeatherInfo> = Object.values(
      outputArr.reduce((acc, item) => {
        acc[item.time] = [...(acc[item.time] || []), item];
        return acc;
      }, {}),
    ).map((element: PredictionDataObject[]) => {
      const temperature = element.map((e) => e.temperature);
      const weatherCode = element.map((e) => e.weatherCode);
      const tmp: WeatherInfo = {
        day: element[0].time,
        avgTemperature: this.tools.getAverage(temperature).toFixed(1),
        weather: this.tools.getWeatherCode(
          Number(this.tools.mostFrequent(weatherCode)),
        ),
      };
      return tmp;
    });

    return {
      location: locationParam,
      weatherInfo: grouped,
    };
  }
}
