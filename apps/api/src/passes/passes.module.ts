import { Module } from '@nestjs/common';
import { PassesController } from './passes.controller';
import { PassesService } from './passes.service';

@Module({
  controllers: [PassesController],
  providers: [PassesService]
})
export class PassesModule {}
