import { Module } from '@nestjs/common';
import { GetModule } from './get/get.module';
import { FetchDataApiModule } from './fetch-data-api/fetch-data-api.module';
import { PredictionModule } from './prediction/prediction.module';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [GetModule, FetchDataApiModule, PredictionModule, ToolsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
