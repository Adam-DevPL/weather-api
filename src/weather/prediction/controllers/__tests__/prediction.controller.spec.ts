import { Test, TestingModule } from '@nestjs/testing';
import { PredictionController } from '../prediction.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { ToolsService } from 'src/tools/tools.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LocationType } from 'src/weather/types/weather.types';
import {
  CityDayParam,
  CountryDatesRangeParam,
  CountryDayParam,
  GeoCoordinatesDatesRangeParam,
} from 'src/validation/validation.module';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PredictionService } from '../../services/prediction.service';
import { ForecastResponse } from 'src/weather/types/prediction.types';
import { LocationTypeException } from 'src/filters/exceptions/exceptions';

describe('PredictionController', () => {
  let controller: PredictionController;
  let service: PredictionService;
  let fetchDataApi: FetchDataApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PredictionController],
      providers: [
        PredictionService,
        FetchDataApiService,
        ToolsService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<PredictionController>(PredictionController);
    service = module.get<PredictionService>(PredictionService);
    fetchDataApi = module.get<FetchDataApiService>(FetchDataApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getForecastForCountry', () => {
    it('should return proper weather response for a counry', async () => {
      //given
      const mockWeatherResponse: ForecastResponse = {
        location: 'country',
        weatherInfo: {
          day: '2023-02-18',
          avgTemperature: '5.5',
          weather: 'sunny',
        },
      };
      jest
        .spyOn(service, 'getForecastForSingleDay')
        .mockImplementation(() => Promise.resolve(mockWeatherResponse));

      //when
      const result = await controller.getForecastForCountry({
        country: 'country',
        day: '2023-02-18',
      });

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw an error when invalid country', async () => {
      //given
      jest.spyOn(service, 'getForecastForSingleDay').mockImplementation(() => {
        throw new LocationTypeException(
          `It is not a ${LocationType[LocationType.COUNTRY]}: invalidCountry`,
        );
      });

      await expect(
        controller.getForecastForCountry({
          day: '2023-02-22',
          country: 'Katowice',
        }),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error, when country is not valid - not a string only with letters', async () => {
      //given
      const myBodyObjectNumber = { country: 123, day: '2023-02-18' };
      const myBodyObjectStringWithNonLetters = {
        country: 'Pol123!@',
        day: '2023-02-18',
      };
      const myObject1 = plainToInstance(CountryDayParam, myBodyObjectNumber);
      const myObject2 = plainToInstance(
        CountryDayParam,
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

    it('should throw error, when day is before actual or after 7 days of current date', async () => {
      //given
      const myBodyObjectNumber = { country: 'Poland', day: '2023-02-10' };
      const myBodyObjectStringWithNonLetters = {
        country: 'Poland',
        day: '2023-03-27',
      };
      const myObject1 = plainToInstance(CountryDayParam, myBodyObjectNumber);
      const myObject2 = plainToInstance(
        CountryDayParam,
        myBodyObjectStringWithNonLetters,
      );

      //when
      const errors1 = await validate(myObject1);
      const errors2 = await validate(myObject2);

      //then
      expect(errors1.length).not.toBe(0);
      expect(errors2.length).not.toBe(0);
      expect(JSON.stringify(errors1)).toContain(
        `Date is out of range: min +1 day and max +7 days`,
      );
      expect(JSON.stringify(errors2)).toContain(
        `Date is out of range: min +1 day and max +7 days`,
      );
    });
  });

  describe('getForecastForCity', () => {
    it('should return proper weather response for a city', async () => {
      //given
      const mockWeatherResponse: ForecastResponse = {
        location: 'city',
        weatherInfo: {
          day: '2023-02-18',
          avgTemperature: '5.5',
          weather: 'sunny',
        },
      };
      jest
        .spyOn(service, 'getForecastForSingleDay')
        .mockImplementation(() => Promise.resolve(mockWeatherResponse));

      //when
      const result = await controller.getForecastForCity({
        city: 'city',
        day: '2023-02-18',
      });

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw an error when invalid city', async () => {
      //given
      jest.spyOn(service, 'getForecastForSingleDay').mockImplementation(() => {
        throw new LocationTypeException(
          `It is not a ${LocationType[LocationType.CITY]}: invalidCity`,
        );
      });

      await expect(
        controller.getForecastForCity({
          day: '2023-02-24',
          city: 'invalidCity',
        }),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error, when city is not valid - not a string only with letters', async () => {
      //given
      const myBodyObjectNumber = { city: 123, day: '2023-02-18' };
      const myBodyObjectStringWithNonLetters = {
        city: 'Pol123!@',
        day: '2023-02-18',
      };
      const myObject1 = plainToInstance(CityDayParam, myBodyObjectNumber);
      const myObject2 = plainToInstance(
        CityDayParam,
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

    it('should throw error, when day is before actual or after 7 days of current date', async () => {
      //given
      const myBodyObjectNumber = { city: 'Poland', day: '2023-02-10' };
      const myBodyObjectStringWithNonLetters = {
        city: 'Poland',
        day: '2023-03-27',
      };
      const myObject1 = plainToInstance(CityDayParam, myBodyObjectNumber);
      const myObject2 = plainToInstance(
        CityDayParam,
        myBodyObjectStringWithNonLetters,
      );

      //when
      const errors1 = await validate(myObject1);
      const errors2 = await validate(myObject2);

      //then
      expect(errors1.length).not.toBe(0);
      expect(errors2.length).not.toBe(0);
      expect(JSON.stringify(errors1)).toContain(
        `Date is out of range: min +1 day and max +7 days`,
      );
      expect(JSON.stringify(errors2)).toContain(
        `Date is out of range: min +1 day and max +7 days`,
      );
    });
  });

  describe('getForecastForCountryInDateRange', () => {
    it('should return proper weather response for a country', async () => {
      //given
      const mockWeatherResponse: ForecastResponse = {
        location: 'country',
        weatherInfo: [
          {
            day: '2023-02-18',
            avgTemperature: '5.5',
            weather: 'sunny',
          },
          {
            day: '2023-02-19',
            avgTemperature: '5.5',
            weather: 'sunny',
          },
          {
            day: '2023-02-20',
            avgTemperature: '5.5',
            weather: 'sunny',
          },
        ],
      };

      jest
        .spyOn(service, 'getForecastForCountryOrCityInDateRange')
        .mockImplementation(() => Promise.resolve(mockWeatherResponse));

      //when
      const result = await controller.getForecastForCountryInDateRange({
        country: 'country',
        from: '2023-02-15',
        to: '2023-02-17',
      });

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw an error when invalid country', async () => {
      //given
      jest
        .spyOn(service, 'getForecastForCountryOrCityInDateRange')
        .mockImplementation(() => {
          throw new LocationTypeException(
            `It is not a ${LocationType[LocationType.COUNTRY]}: invalidCountry`,
          );
        });

      await expect(
        controller.getForecastForCountryInDateRange({
          from: '2023-02-22',
          to: '2023-02-25',
          country: 'invalidCountry',
        }),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error, when country is not valid - not a string only with letters', async () => {
      //given
      const myBodyObjectNumber = {
        country: 123,
        from: '2023-02-18',
        to: '2023-02-20',
      };
      const myBodyObjectStringWithNonLetters = {
        city: 'Pol123!@',
        from: '2023-02-18',
        to: '2023-02-20',
      };
      const myObject1 = plainToInstance(
        CountryDatesRangeParam,
        myBodyObjectNumber,
      );
      const myObject2 = plainToInstance(
        CountryDatesRangeParam,
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

    it('should throw error, when day is before actual or after 7 days of current date', async () => {
      //given
      const myBodyObjectNumber = {
        country: 'Poland',
        from: '2023-02-10',
        to: '2023-02-27',
      };
      const myObject1 = plainToInstance(
        CountryDatesRangeParam,
        myBodyObjectNumber,
      );

      //when
      const errors = await validate(myObject1);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        `Date is out of range: min +1 day and max +7 days`,
      );
    });

    it('should throw error, when from date is later then to date', async () => {
      //given
      // jest
      //   .spyOn(service, 'getForecastForCountryOrCityInDateRange')
      //   .mockImplementation(() => {
      //     throw new HttpException(
      //       `Invalid dates order. Date "from" is later then "to" date`,
      //       HttpStatus.BAD_REQUEST,
      //     );
      //   });

      await expect(
        controller.getForecastForCountryInDateRange({
          from: '2023-02-26',
          to: '2023-02-23',
          country: 'country',
        }),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('getForecastForCityInDateRange', () => {
    //the same test as for country
  });

  describe('getForecastForCoordinatesInDateRange', () => {
    //the same test as for country + below
    it('should return error when latitude or longitude is out of range -180 < x < 180', async () => {
      //given
      const myBodyObject = {
        lat: -200,
        lon: 79,
        from: '2023-02-10',
        to: '2023-02-27',
      };
      const myObject = plainToInstance(
        GeoCoordinatesDatesRangeParam,
        myBodyObject,
      );

      //when
      const errors = await validate(myObject);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        `Date is out of range: min +1 day and max +7 days`,
      );
      expect(JSON.stringify(errors)).toContain(
        `Latitude and longitude must be in range -180 < x < 180`,
      );
    });
  });
});
