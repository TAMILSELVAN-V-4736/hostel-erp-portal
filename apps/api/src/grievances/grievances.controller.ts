import { Controller, Post, Body, Get, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('grievances')
@UseGuards(AuthGuard)
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Post()
  async createGrievance(
    @Req() req: any,
    @Body() body: { title: string; description: string },
  ) {
    return this.grievancesService.createGrievance(
      req.user.sub,
      body.title,
      body.description,
    );
  }

  @Get('my-requests')
  async getMyGrievances(@Req() req: any) {
    return this.grievancesService.getMyGrievances(req.user.sub);
  }

  @Get()
  async getAllGrievances() {
    return this.grievancesService.getAllGrievances();
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.grievancesService.updateStatus(id, body.status);
  }
}
