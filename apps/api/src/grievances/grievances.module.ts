import { Module } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { GrievancesController } from './grievances.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GrievancesController],
  providers: [GrievancesService],
})
export class GrievancesModule {}
