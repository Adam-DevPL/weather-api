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
import { temperature, time, weathercode } from './testData';
import {
  InternalServerException,
  LocationException,
} from 'src/filters/exceptions/exceptions';

describe('PredictionService', () => {
  let service: PredictionService;
  let fetchDataApi: FetchDataApiService;

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
      expect(result).toMatchSnapshot();
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
      expect(result).toMatchSnapshot();
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

      await expect(
        service.getForecastForSingleDay(locationNameInputDay),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error, when unnamed city - forecast on 1 day', async () => {
      //given
      const locationNameInputDay: LocationNameInputDay = {
        day: '2023-02-15',
        locationName: 'xxxxx',
        locationType: LocationType.CITY,
      };

      jest.spyOn(fetchDataApi, 'getGeoLocation').mockImplementation(() => {
        throw new LocationException('Location not found');
      });

      await expect(
        service.getForecastForSingleDay(locationNameInputDay),
      ).rejects.toMatchSnapshot();
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
      expect(result).toMatchSnapshot();
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
        throw new LocationException('Location not found');
      });

      await expect(
        service.getForecastForCountryOrCityInDateRange(locationNameInputDates),
      ).rejects.toMatchSnapshot();
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
      expect(result).toMatchSnapshot();
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
        throw new InternalServerException('Internal server error');
      });

      await expect(
        service.getForecastForGeoLocationInDateRange(coordinatesInputDates),
      ).rejects.toMatchSnapshot();
    });
  });
});
