import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FetchDataApiService } from './fetch-data-api.service';

@Module({
  imports: [HttpModule],
  providers: [FetchDataApiService],
})
export class FetchDataApiModule {}
