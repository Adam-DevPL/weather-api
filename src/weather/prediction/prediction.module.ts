import { Module } from '@nestjs/common';
import { FetchDataApiModule } from 'src/fetch-data-api/fetch-data-api.module';
import { ToolsModule } from 'src/tools/tools.module';
import { PredictionController } from './controllers/prediction.controller';
import { PredictionService } from './services/prediction.service';

@Module({
  imports: [FetchDataApiModule, ToolsModule],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
