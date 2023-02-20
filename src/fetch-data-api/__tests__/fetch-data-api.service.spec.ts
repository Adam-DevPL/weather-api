import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { FetchDataApiException } from 'src/filters/exceptions/fetch-data-api.exception';
import { FetchDataApiService } from '../fetch-data-api.service';

describe('FetchDataApiService', () => {
  let service: FetchDataApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchDataApiService,
        ConfigService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FetchDataApiService>(FetchDataApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGeoLocation', () => {
    it('should throw error when invalid location', async () => {
      expect.assertions(1);
      //given
      const locationName = 'jhjdhjsd';

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {
            invalid: 'invalid',
          },
          headers: {},
          config: { url: 'mockGeoUrl' },
          status: 200,
          statusText: 'OK',
        }) as any,
      );

      //then
      await expect(
        service.getGeoLocation(locationName),
      ).rejects.toMatchSnapshot();
    });
  });

  it('should throw error when problem with external api', async () => {
    expect.assertions(1);
    //given
    const locationName = 'Poland';

    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw new HttpException('Invalid URL', HttpStatus.BAD_REQUEST);
    });

    //then
    await expect(
      service.getGeoLocation(locationName),
    ).rejects.toMatchSnapshot();
  });
});
