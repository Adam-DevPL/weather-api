import { HttpModule } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { GetService } from 'src/weather/get/services/get.service';
import { WeatherResponse } from 'src/weather/types/get.types';
import { ToolsService } from 'src/tools/tools.service';
import { LocationType } from 'src/weather/types/weather.types';
import { GetController } from './get.controller';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import {
  CityParam,
  CountryParam,
  GeoCoordinatesParam,
} from 'src/Validation/validation.module';
import { validate } from 'class-validator';

describe('GetController', () => {
  let controller: GetController;
  let service: GetService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [GetController],
      providers: [GetService, FetchDataApiService, ToolsService, ConfigService],
    }).compile();

    service = moduleRef.get<GetService>(GetService);
    controller = moduleRef.get<GetController>(GetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeatherForCountry', () => {
    it('should return a WeatherResponse for a valid city', async () => {
      //given
      const mockWeatherResponse: WeatherResponse = {
        location: 'coutryName',
        avgTemperature: 20,
        weather: 'Sunny',
      };
      jest
        .spyOn(service, 'getCurrentWeatherWithoutCoordinates')
        .mockImplementation(() => Promise.resolve(mockWeatherResponse));

      //when
      const result = await controller.getWeatherForCountry({
        country: 'countryName',
      });

      //then
      expect(result).toEqual(mockWeatherResponse);
    });

    it('should throw an error for an invalid country', async () => {
      //given
      jest
        .spyOn(service, 'getCurrentWeatherWithoutCoordinates')
        .mockImplementation(() => {
          throw new HttpException(
            `It is not a ${LocationType[LocationType.COUNTRY]}: invalidCountry`,
            HttpStatus.BAD_REQUEST,
          );
        });

      try {
        //when
        await controller.getWeatherForCountry({
          country: 'invalidCountry',
        });
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(
          `It is not a ${LocationType[LocationType.COUNTRY]}: invalidCountry`,
        );
      }
    });

    it('should fail on invalid city - not a string or string with no only letters', async () => {
      //given
      const myBodyObjectNumber = { country: 123 };
      const myBodyObjectStringWithNonLetters = { country: 'Pol123!@' };
      const myObject1 = plainToInstance(CountryParam, myBodyObjectNumber);
      const myObject2 = plainToInstance(
        CountryParam,
        myBodyObjectStringWithNonLetters,
      );

      //when
      const errors1 = await validate(myObject1);
      const errors2 = await validate(myObject2);

      //then
      expect(errors1.length).not.toBe(0);
      expect(errors2.length).not.toBe(0);
      expect(JSON.stringify(errors1)).toContain(`country must be a string`);
      expect(JSON.stringify(errors2)).toContain(
        `country must contain only letters (a-zA-Z)`,
      );
    });
  });

  describe('getWeatherForCity', () => {
    it('should return a WeatherResponse for a valid country', async () => {
      //given
      const mockWeatherResponse: WeatherResponse = {
        location: 'cityName',
        avgTemperature: 20,
        weather: 'Sunny',
      };
      jest
        .spyOn(service, 'getCurrentWeatherWithoutCoordinates')
        .mockImplementation(() => Promise.resolve(mockWeatherResponse));

      //when
      const result = await controller.getWeatherForCity({
        city: 'cityName',
      });

      //then
      expect(result).toEqual(mockWeatherResponse);
    });

    it('should throw an error for an invalid city', async () => {
      //given
      jest
        .spyOn(service, 'getCurrentWeatherWithoutCoordinates')
        .mockImplementation(() => {
          throw new HttpException(
            `It is not a ${LocationType[LocationType.COUNTRY]}: invalidCity`,
            HttpStatus.BAD_REQUEST,
          );
        });

      try {
        //when
        await controller.getWeatherForCountry({
          country: 'invalidCity',
        });
      } catch (error) {
        //then
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(
          `It is not a ${LocationType[LocationType.COUNTRY]}: invalidCity`,
        );
      }
    });

    it('should fail on invalid city - not a string or string with no only letters', async () => {
      //given
      const myBodyObjectNumber = { city: 123 };
      const myBodyObjectStringWithNonLetters = { city: 'Kato123!@' };
      const myObject1 = plainToInstance(CityParam, myBodyObjectNumber);
      const myObject2 = plainToInstance(
        CityParam,
        myBodyObjectStringWithNonLetters,
      );

      //when
      const errors1 = await validate(myObject1);
      const errors2 = await validate(myObject2);

      //then
      expect(errors1.length).not.toBe(0);
      expect(errors2.length).not.toBe(0);
      expect(JSON.stringify(errors1)).toContain(`city must be a string`);
      expect(JSON.stringify(errors2)).toContain(
        `city must contain only letters (a-zA-Z)`,
      );
    });
  });

  describe('getWeatherForCity', () => {
    it('should return a WeatherResponse for a valid coordinates', async () => {
      //given
      const mockWeatherResponse: WeatherResponse = {
        location: {
          latitude: 20,
          longitude: 20,
        },
        avgTemperature: 20,
        weather: 'Sunny',
      };
      jest
        .spyOn(service, 'getCurrentWeatherWithCoordinates')
        .mockImplementation(() => Promise.resolve(mockWeatherResponse));

      //when
      const result = await controller.getLocationWeather({
        lat: 20,
        lon: 20,
      });

      //then
      expect(result).toEqual(mockWeatherResponse);
    });

    it('should fail on invalid coordinates - not a number or not in range -180 and 180', async () => {
      //given
      const myBodyObjectNotNumber = { lat: 'lat', lon: 0 };
      const myBodyObjectLatBelow = { lat: -190, lon: 25 };
      const myBodyObjectLonAbove = { lat: -25, lon: 225 };
      const myObject1 = plainToInstance(
        GeoCoordinatesParam,
        myBodyObjectNotNumber,
      );
      const myObject2 = plainToInstance(
        GeoCoordinatesParam,
        myBodyObjectLatBelow,
      );
      const myObject3 = plainToInstance(
        GeoCoordinatesParam,
        myBodyObjectLonAbove,
      );

      //when
      const errors1 = await validate(myObject1);
      const errors2 = await validate(myObject2);
      const errors3 = await validate(myObject3);

      //then
      expect(errors1.length).not.toBe(0);
      expect(errors2.length).not.toBe(0);
      expect(errors3.length).not.toBe(0);

      expect(JSON.stringify(errors1)).toContain(`lat must be a number`);
      expect(JSON.stringify(errors2)).toContain(
        `Latitude and longitude must be in range -180 < x < 180`,
      );
      expect(JSON.stringify(errors3)).toContain(
        `Latitude and longitude must be in range -180 < x < 180`,
      );
    });
  });
});
