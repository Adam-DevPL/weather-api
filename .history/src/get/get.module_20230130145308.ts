import { Module } from '@nestjs/common';
import { FetchDataApiModule } from 'src/utils/fetch-data-api/fetch-data-api.module';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';
import { GetController } from './controllers/get/get.controller';

@Module({
  imports: [FetchDataApiModule],
  controllers: [GetController],
})
export class GetModule {}
