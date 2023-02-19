import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { ToolsService } from 'src/tools/tools.service';
import { GetService } from './get.service';
import { ConfigService } from '@nestjs/config';
import {
  CoordinatesInput,
  LocationNameInput,
  LocationType,
} from 'src/weather/types/weather.types';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('GetService', () => {
  let service: GetService;
  let fetchDataApi: FetchDataApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GetService, FetchDataApiService, ToolsService, ConfigService],
    }).compile();

    service = module.get<GetService>(GetService);
    fetchDataApi = module.get<FetchDataApiService>(FetchDataApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentWeatherWithoutCoordinates', () => {
    it('should return a weather resposne for country', async () => {
      //given
      const locationNameParam: LocationNameInput = {
        locationType: LocationType.COUNTRY,
        locationName: 'Poland',
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 52,
        longitude: 20,
        location: LocationType.COUNTRY,
      });

      jest
        .spyOn(service, <any>'getApiData')
        .mockResolvedValue({ avgTemperature: 10, weather: 'Rain' });

      //when
      const result = await service.getCurrentWeatherWithoutCoordinates(
        locationNameParam,
      );

      //then
      expect(result).toEqual({
        location: 'Poland',
        avgTemperature: 10,
        weather: 'Rain',
      });
    });

    it('should return a weather resposne for city', async () => {
      //given
      const locationNameParam: LocationNameInput = {
        locationType: LocationType.CITY,
        locationName: 'City',
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 52,
        longitude: 20,
        location: LocationType.CITY,
      });

      jest
        .spyOn(service, <any>'getApiData')
        .mockResolvedValue({ avgTemperature: 10, weather: 'Rain' });

      //when
      const result = await service.getCurrentWeatherWithoutCoordinates(
        locationNameParam,
      );

      //then
      expect(result).toEqual({
        location: 'City',
        avgTemperature: 10,
        weather: 'Rain',
      });
    });

    it('should throw error for invalid parameters, getting City instead of Country', async () => {
      //given
      const locationNameParam: LocationNameInput = {
        locationType: LocationType.COUNTRY,
        locationName: 'City',
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockResolvedValue({
        latitude: 52,
        longitude: 20,
        location: LocationType.CITY,
      });

      jest
        .spyOn(service, 'getCurrentWeatherWithoutCoordinates')
        .mockImplementation(() => {
          throw new HttpException(
            `It is not a ${LocationType[LocationType.COUNTRY]}: City`,
            HttpStatus.BAD_REQUEST,
          );
        });

      try {
        //when
        await service.getCurrentWeatherWithoutCoordinates(locationNameParam);
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(
          `It is not a ${LocationType[LocationType.COUNTRY]}: City`,
        );
      }
    });

    it('should throw error for invalid parameters - location name in invalid', async () => {
      //given
      const locationNameParam: LocationNameInput = {
        locationType: LocationType.COUNTRY,
        locationName: 'xxxxxx',
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockImplementation(() => {
        throw new HttpException('Location not found', HttpStatus.BAD_REQUEST);
      });

      try {
        //when
        await service.getCurrentWeatherWithoutCoordinates(locationNameParam);
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`Location not found`);
      }
    });
  });

  describe('getCurrentWeatherWithCoordinates', () => {
    it('should return weather response for coordinates', async () => {
      const coordinatesInput: CoordinatesInput = {
        lat: 20,
        lon: 20,
      };

      jest
        .spyOn(service, <any>'getApiData')
        .mockResolvedValue({ avgTemperature: 10, weather: 'Rain' });

      //when
      const result = await service.getCurrentWeatherWithCoordinates(
        coordinatesInput,
      );

      //then
      expect(result).toEqual({
        location: {
          latitude: 20,
          longitude: 20,
        },
        avgTemperature: 10,
        weather: 'Rain',
      });
    });
  });
});
