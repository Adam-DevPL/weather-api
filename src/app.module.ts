import { Module } from '@nestjs/common';
import { GetModule } from './get/get.module';

@Module({
  imports: [GetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
