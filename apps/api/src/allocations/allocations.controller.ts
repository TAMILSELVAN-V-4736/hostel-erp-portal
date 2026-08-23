import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AllocationsService } from './allocations.service';
import { RoomAllocation, Prisma, Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('allocations')
@UseGuards(AuthGuard, RolesGuard)
export class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Post()
  async createAllocation(@Body() allocationData: Prisma.RoomAllocationUncheckedCreateInput): Promise<RoomAllocation> {
    return this.allocationsService.createAllocation(allocationData);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Get()
  async getAllocations(): Promise<RoomAllocation[]> {
    return this.allocationsService.allocations({});
  }
}
