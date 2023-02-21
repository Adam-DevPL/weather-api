import { Module } from '@nestjs/common';
import { FetchDataApiModule } from 'src/fetch-data-api/fetch-data-api.module';
import { ToolsModule } from 'src/tools/tools.module';
import { GetController } from './controllers/get.controller';
import { GetService } from './services/get.service';

@Module({
  imports: [FetchDataApiModule, ToolsModule],
  controllers: [GetController],
  providers: [GetService],
})
export class GetModule {}
