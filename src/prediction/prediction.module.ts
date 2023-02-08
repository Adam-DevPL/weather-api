import { Module } from '@nestjs/common';
import { FetchDataApiModule } from 'src/utils/fetch-data-api/fetch-data-api.module';
import { ToolsModule } from 'src/utils/tools/tools.module';
import { PredictionController } from './controllers/prediction/prediction.controller';
import { PredictionService } from './services/prediction/prediction.service';

@Module({
  imports: [FetchDataApiModule, ToolsModule],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
