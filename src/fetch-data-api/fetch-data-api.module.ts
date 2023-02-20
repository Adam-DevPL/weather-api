import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FetchDataApiFilter } from 'src/filters/fetch-data-api.filter';
import { FetchDataApiService } from './fetch-data-api.service';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [HttpModule],
  providers: [
    FetchDataApiService,
    {
      provide: APP_FILTER,
      useClass: FetchDataApiFilter,
    },
  ],
  exports: [FetchDataApiService],
})
export class FetchDataApiModule {}
