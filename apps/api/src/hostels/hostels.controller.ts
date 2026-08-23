import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HostelsService } from './hostels.service';
import { Hostel, Prisma, Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('hostels')
@UseGuards(AuthGuard, RolesGuard)
export class HostelsController {
  constructor(private readonly hostelsService: HostelsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Post()
  async createHostel(@Body() hostelData: Prisma.HostelCreateInput): Promise<Hostel> {
    return this.hostelsService.createHostel(hostelData);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN, Role.STUDENT)
  @Get()
  async getAllHostels(): Promise<Hostel[]> {
    return this.hostelsService.hostels({});
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN, Role.STUDENT)
  @Get(':id')
  async getHostelById(@Param('id') id: string): Promise<Hostel | null> {
    return this.hostelsService.hostel({ id });
  }
}
