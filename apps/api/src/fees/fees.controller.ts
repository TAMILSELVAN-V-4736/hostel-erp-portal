import { Controller, Get, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { FeesService } from './fees.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('fees')
@UseGuards(AuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('my-fees')
  async getMyFees(@Req() req: any) {
    return this.feesService.getMyFees(req.user.sub);
  }

  @Post(':id/pay')
  async payFee(@Param('id') id: string, @Req() req: any) {
    return this.feesService.payFee(id, req.user.sub);
  }
  @Get()
  async getAllFees() {
    return this.feesService.getAllFees();
  }

  @Post()
  async generateFee(
    @Body() body: { studentId: string; amount: number; type: string; dueDate: string }
  ) {
    return this.feesService.generateFee(
      body.studentId,
      body.amount,
      body.type,
      body.dueDate
    );
  }
}
