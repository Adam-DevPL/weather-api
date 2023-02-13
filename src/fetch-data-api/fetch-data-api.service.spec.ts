import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { Test, TestingModule } from '@nestjs/testing';
import { FetchDataApiService } from './fetch-data-api.service';

describe('FetchDataApiService', () => {
  let service: FetchDataApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [FetchDataApiService, ConfigService],
    }).compile();

    service = module.get<FetchDataApiService>(FetchDataApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
