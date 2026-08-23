import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveNotices(role: string) {
    // For simplicity, just get all notices for students or 'ALL'
    return this.prisma.notice.findMany({
      where: {
        targetAudience: { in: ['ALL', 'STUDENT'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async createNotice(title: string, content: string, createdById: string) {
    return this.prisma.notice.create({
      data: {
        title,
        content,
        targetAudience: 'ALL',
      }
    });
  }
}
