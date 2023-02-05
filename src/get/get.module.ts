import { Module } from '@nestjs/common';
import { FetchDataApiModule } from 'src/utils/fetch-data-api/fetch-data-api.module';
import { ToolsModule } from 'src/utils/tools/tools.module';
import { GetController } from './controllers/get/get.controller';
import { GetService } from './services/get/get.service';

@Module({
  imports: [FetchDataApiModule, ToolsModule],
  controllers: [GetController],
  providers: [GetService],
})
export class GetModule {}
