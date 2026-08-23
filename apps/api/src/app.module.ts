import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { HostelsModule } from './hostels/hostels.module';
import { AllocationsModule } from './allocations/allocations.module';
import { LeavesModule } from './leaves/leaves.module';
import { PassesModule } from './passes/passes.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { MessModule } from './mess/mess.module';
import { GrievancesModule } from './grievances/grievances.module';
import { NoticesModule } from './notices/notices.module';
import { FeesModule } from './fees/fees.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, StudentsModule, HostelsModule, AllocationsModule, LeavesModule, PassesModule, MaintenanceModule, MessModule, GrievancesModule, NoticesModule, FeesModule, AnalyticsModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
