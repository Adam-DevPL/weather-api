import { Test, TestingModule } from '@nestjs/testing';
import { PredictionController } from './prediction.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FetchDataApiService } from 'src/fetch-data-api/fetch-data-api.service';
import { ToolsService } from 'src/tools/tools.service';
import { PredictionService } from 'src/prediction/services/prediction/prediction.service';

describe('PredictionController', () => {
  let controller: PredictionController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
