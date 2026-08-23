import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto, UpdatePassStatusDto } from './dto/pass.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@Controller('passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}

  @Roles(Role.STUDENT)
  @Post()
  create(@Request() req: any, @Body() createPassDto: CreatePassDto) {
    return this.passesService.create(req.user.sub, createPassDto);
  }

  @Roles(Role.STUDENT)
  @Get('my-passes')
  findMine(@Request() req: any) {
    return this.passesService.findAllForStudent(req.user.sub);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Get()
  findAll() {
    return this.passesService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Patch(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdatePassStatusDto,
  ) {
    return this.passesService.updateStatus(id, req.user.sub, updateDto);
  }
}
