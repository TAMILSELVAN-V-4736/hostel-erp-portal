import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto, UpdateLeaveStatusDto } from './dto/leave.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Roles(Role.STUDENT)
  @Post()
  create(@Request() req: any, @Body() createLeaveDto: CreateLeaveDto) {
    return this.leavesService.create(req.user.sub, createLeaveDto);
  }

  @Roles(Role.STUDENT)
  @Get('my-leaves')
  findMine(@Request() req: any) {
    return this.leavesService.findAllForStudent(req.user.sub);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Get()
  findAll() {
    return this.leavesService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Patch(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateLeaveStatusDto,
  ) {
    return this.leavesService.updateStatus(id, req.user.sub, updateDto);
  }
}
