import { Module } from '@nestjs/common';
import { GetController } from './controllers/get/get.controller';

@Module({
  controllers: [GetController],
})
export class GetModule {}
