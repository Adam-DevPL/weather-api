import { Module } from '@nestjs/common';
import { GetModule } from './get/get.module';
import { FetchDataApiModule } from './utils/fetch-data-api/fetch-data-api.module';

@Module({
  imports: [GetModule, FetchDataApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
