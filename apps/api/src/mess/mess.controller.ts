import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { MessService } from './mess.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('mess')
@UseGuards(AuthGuard)
export class MessController {
  constructor(private readonly messService: MessService) {}

  @Get('menu/today')
  async getTodayMenu() {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return this.messService.getMenuForDay(today);
  }

  @Post('feedback')
  async submitFeedback(
    @Req() req: any,
    @Body() body: { rating: number; comment: string },
  ) {
    return this.messService.submitFeedback(req.user.sub, body.rating, body.comment);
  }

  @Get('feedback')
  async getAllFeedback() {
    return this.messService.getAllFeedback();
  }

  @Get('menu')
  async getWeeklyMenu() {
    return this.messService.getWeeklyMenu();
  }

  @Post('menu')
  async updateMenu(
    @Body() body: {
      dayOfWeek: number;
      breakfast: string;
      lunch: string;
      snacks: string;
      dinner: string;
    }
  ) {
    return this.messService.updateMenu(
      body.dayOfWeek,
      body.breakfast,
      body.lunch,
      body.snacks,
      body.dinner
    );
  }
}
