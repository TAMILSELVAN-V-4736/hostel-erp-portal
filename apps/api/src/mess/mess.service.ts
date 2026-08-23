import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessService {
  constructor(private readonly prisma: PrismaService) {}

  async getMenuForDay(dayOfWeek: number) {
    let menu = await this.prisma.messMenu.findFirst({
      where: { dayOfWeek },
    });

    if (!menu) {
      // Mock some data if no menu is seeded
      menu = {
        id: 'mock',
        dayOfWeek,
        breakfast: 'Idli, Sambar, Chutney, Tea/Coffee',
        lunch: 'Rice, Dal, Chapati, Mixed Veg Curry, Curd',
        snacks: 'Samosa, Tea/Coffee',
        dinner: 'Rice, Roti, Paneer Butter Masala, Dal Makhani',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return menu;
  }

  async getWeeklyMenu() {
    return this.prisma.messMenu.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async submitFeedback(userId: string, rating: number, comment: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    return this.prisma.messFeedback.create({
      data: {
        studentId: student.id,
        rating,
        comment,
      },
    });
  }

  async getAllFeedback() {
    return this.prisma.messFeedback.findMany({
      include: {
        student: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateMenu(
    dayOfWeek: number,
    breakfast: string,
    lunch: string,
    snacks: string,
    dinner: string
  ) {
    const existing = await this.prisma.messMenu.findFirst({
      where: { dayOfWeek }
    });

    if (existing) {
      return this.prisma.messMenu.update({
        where: { id: existing.id },
        data: { breakfast, lunch, snacks, dinner }
      });
    }

    return this.prisma.messMenu.create({
      data: { dayOfWeek, breakfast, lunch, snacks, dinner }
    });
  }
}
