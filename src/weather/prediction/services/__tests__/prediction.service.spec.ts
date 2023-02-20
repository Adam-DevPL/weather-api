import { Test, TestingModule } from '@nestjs/testing';
import { PredictionService } from '../prediction.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { ToolsService } from 'src/tools/tools.service';
import {
  CoordinatesInputDates,
  LocationNameInputDates,
  LocationNameInputDay,
  LocationType,
} from 'src/weather/types/weather.types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { temperature, time, weathercode } from './testData';

describe('PredictionService', () => {
  let service: PredictionService;
  let fetchDataApi: FetchDataApiService;
  // let tools: ToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PredictionService,
        FetchDataApiService,
        ToolsService,
        ConfigService,
      ],
    }).compile();

    service = module.get<PredictionService>(PredictionService);
    fetchDataApi = module.get<FetchDataApiService>(FetchDataApiService);
    // tools = module.get<ToolsService>(ToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getForecastForSingleDay', () => {
    it('should return weather response for valid country - forecast on 1 day', async () => {
      //given
      const locationNameInputDay: LocationNameInputDay = {
        day: '2023-02-15',
        locationName: 'country',
        locationType: LocationType.COUNTRY,
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 20,
        longitude: 20,
        location: LocationType.COUNTRY,
      });

      jest.spyOn(service, <any>'getDataApi').mockResolvedValue({
        temperatureArr: [10, 20, 30],
        weatherCodeArr: [2, 2, 2],
      });

      //when
      const result = await service.getForecastForSingleDay(
        locationNameInputDay,
      );

      //then
      expect(result).toEqual({
        location: 'country',
        weatherInfo: {
          day: '2023-02-15',
          avgTemperature: '20.0',
          weather: 'Mainly clear, partly cloudy, and overcast',
        },
      });
    });

    it('should return weather response for valid city - forecast on 1 day', async () => {
      //given
      const locationNameInputDay: LocationNameInputDay = {
        day: '2023-02-15',
        locationName: 'city',
        locationType: LocationType.CITY,
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 20,
        longitude: 20,
        location: LocationType.CITY,
      });

      jest.spyOn(service, <any>'getDataApi').mockResolvedValue({
        temperatureArr: [10, 20, 30],
        weatherCodeArr: [2, 2, 2],
      });

      //when
      const result = await service.getForecastForSingleDay(
        locationNameInputDay,
      );

      //then
      expect(result).toEqual({
        location: 'city',
        weatherInfo: {
          day: '2023-02-15',
          avgTemperature: '20.0',
          weather: 'Mainly clear, partly cloudy, and overcast',
        },
      });
    });

    it('should throw error, when wants country, but get city - forecast on 1 day', async () => {
      //given
      const locationNameInputDay: LocationNameInputDay = {
        day: '2023-02-15',
        locationName: 'city',
        locationType: LocationType.COUNTRY,
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 20,
        longitude: 20,
        location: LocationType.CITY,
      });

      jest.spyOn(service, 'getForecastForSingleDay').mockImplementation(() => {
        throw new HttpException(
          `It is not a ${LocationType[LocationType.COUNTRY]}: City`,
          HttpStatus.BAD_REQUEST,
        );
      });

      try {
        //when
        await service.getForecastForSingleDay(locationNameInputDay);
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(
          `It is not a ${LocationType[LocationType.COUNTRY]}: City`,
        );
      }
    });

    it('should throw error, when unnamed city - forecast on 1 day', async () => {
      //given
      const locationNameInputDay: LocationNameInputDay = {
        day: '2023-02-15',
        locationName: 'xxxxx',
        locationType: LocationType.CITY,
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockImplementation(() => {
        throw new HttpException('Location not found', HttpStatus.BAD_REQUEST);
      });

      try {
        //when
        await service.getForecastForSingleDay(locationNameInputDay);
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`Location not found`);
      }
    });
  });

  describe('getForecastForCountryOrCityInDateRange', () => {
    it('should return weather info for a country/city in data range', async () => {
      //given
      const locationNameInputDates: LocationNameInputDates = {
        locationType: LocationType.COUNTRY,
        locationName: 'country',
        from: '2023-02-15',
        to: '2023-02-17',
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 20,
        longitude: 20,
        location: LocationType.COUNTRY,
      });

      jest.spyOn(service, <any>'getDataApi').mockResolvedValue({
        timeArr: time,
        temperatureArr: temperature,
        weatherCodeArr: weathercode,
      });

      //when
      const result = await service.getForecastForCountryOrCityInDateRange(
        locationNameInputDates,
      );

      //then
      expect(result).toEqual({
        location: 'country',
        weatherInfo: [
          {
            day: '2023-02-15',
            avgTemperature: '1.5',
            weather: 'Fog and depositing rime fog',
          },
          {
            day: '2023-02-16',
            avgTemperature: '2.3',
            weather: 'Mainly clear, partly cloudy, and overcast',
          },
          {
            day: '2023-02-17',
            avgTemperature: '5.3',
            weather: 'Rain: Slight, moderate and heavy intensity',
          },
        ],
      });
    });

    it('should throw error when unnamed country id dates range', async () => {
      //given
      const locationNameInputDates: LocationNameInputDates = {
        locationType: LocationType.COUNTRY,
        locationName: 'city',
        from: '2023-02-15',
        to: '2023-02-17',
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockImplementation(() => {
        throw new HttpException('Location not found', HttpStatus.BAD_REQUEST);
      });

      try {
        //when
        await service.getForecastForCountryOrCityInDateRange(
          locationNameInputDates,
        );
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`Location not found`);
      }
    });
  });

  describe('getForecastForGeoLocationInDateRange', () => {
    it('should return weather response when valid coordinates', async () => {
      //given
      const coordinatesInputDates: CoordinatesInputDates = {
        lat: 20,
        lon: 20,
        from: '2023-02-15',
        to: '2023-02-17',
      };

      jest.spyOn(service, <any>'getDataApi').mockResolvedValue({
        timeArr: time,
        temperatureArr: temperature,
        weatherCodeArr: weathercode,
      });

      //when
      const result = await service.getForecastForGeoLocationInDateRange(
        coordinatesInputDates,
      );

      //then
      expect(result).toEqual({
        location: {
          latitude: 20,
          longitude: 20,
        },
        weatherInfo: [
          {
            day: '2023-02-15',
            avgTemperature: '1.5',
            weather: 'Fog and depositing rime fog',
          },
          {
            day: '2023-02-16',
            avgTemperature: '2.3',
            weather: 'Mainly clear, partly cloudy, and overcast',
          },
          {
            day: '2023-02-17',
            avgTemperature: '5.3',
            weather: 'Rain: Slight, moderate and heavy intensity',
          },
        ],
      });
    });

    it('should throw error when problem with external api occur', async () => {
      //given
      const coordinatesInputDates: CoordinatesInputDates = {
        lat: 20,
        lon: 20,
        from: '2023-02-15',
        to: '2023-02-17',
      };

      jest.spyOn(service, <any>'getDataApi').mockImplementation(() => {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

      try {
        //when
        await service.getForecastForGeoLocationInDateRange(
          coordinatesInputDates,
        );
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe('Internal server error');
      }
    });
  });
});
