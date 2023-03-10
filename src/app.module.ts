import { Module } from '@nestjs/common';
import { GetModule } from './weather/get/get.module';
import { FetchDataApiModule } from './fetch-data-api/fetch-data-api.module';
import { ToolsModule } from './tools/tools.module';
import { ConfigModule } from '@nestjs/config';
import { PredictionModule } from './weather/prediction/prediction.module';

@Module({
  imports: [
    GetModule,
    FetchDataApiModule,
    PredictionModule,
    ToolsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
