import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('rooms')
@UseGuards(AuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Get()
  async getAllRooms() {
    return this.roomsService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Post()
  async createRoom(@Body() roomData: any) {
    return this.roomsService.createRoom(roomData);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Put(':id')
  async updateRoom(@Param('id') id: string, @Body() roomData: any) {
    return this.roomsService.updateRoom(id, roomData);
  }
}
