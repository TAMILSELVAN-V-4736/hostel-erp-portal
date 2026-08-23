import { Controller, Post, Body, Get, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MaintenanceCategory, RequestStatus, Role } from '@prisma/client';

@Controller('maintenance')
@UseGuards(AuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  async createRequest(
    @Req() req: any,
    @Body() body: { title: string; description: string; category: MaintenanceCategory },
  ) {
    return this.maintenanceService.create(req.user.sub, body);
  }

  @Get('my-requests')
  async getMyRequests(@Req() req: any) {
    return this.maintenanceService.getMyRequests(req.user.sub);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN, Role.MAINTENANCE_STAFF)
  @Get()
  async getAllRequests() {
    return this.maintenanceService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN, Role.MAINTENANCE_STAFF)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: RequestStatus; assignedToId?: string },
  ) {
    return this.maintenanceService.updateStatus(id, body.status, body.assignedToId);
  }
}
