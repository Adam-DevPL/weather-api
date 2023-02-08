import { Test, TestingModule } from '@nestjs/testing';
import { FetchDataApiService } from './fetch-data-api.service';

describe('FetchDataApiService', () => {
  let service: FetchDataApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchDataApiService],
    }).compile();

    service = module.get<FetchDataApiService>(FetchDataApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
