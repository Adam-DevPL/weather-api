import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { GetModule } from './get/get.module';

@Module({
  imports: [GetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
