import { Module } from '@nestjs/common';
import { MessService } from './mess.service';
import { MessController } from './mess.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessController],
  providers: [MessService],
})
export class MessModule {}
