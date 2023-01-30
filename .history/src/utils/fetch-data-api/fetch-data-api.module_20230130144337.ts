import { Module } from '@nestjs/common';
import { FetchDataApiService } from './fetch-data-api.service';

@Module({
  providers: [FetchDataApiService]
})
export class FetchDataApiModule {}
