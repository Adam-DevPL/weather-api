import { Module } from '@nestjs/common';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';
import { GetController } from './controllers/get/get.controller';

@Module({
  controllers: [GetController],
})
export class GetModule {}
