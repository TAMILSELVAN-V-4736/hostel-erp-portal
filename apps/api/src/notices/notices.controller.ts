import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notices')
@UseGuards(AuthGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  async getActiveNotices(@Req() req: any) {
    return this.noticesService.getActiveNotices(req.user.role);
  }

  @Post()
  async createNotice(@Req() req: any, @Body() body: { title: string; content: string }) {
    return this.noticesService.createNotice(body.title, body.content, req.user.sub);
  }
}
