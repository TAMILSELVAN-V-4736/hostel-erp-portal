import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GrievancesService {
  constructor(private readonly prisma: PrismaService) {}

  async createGrievance(userId: string, title: string, description: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');
    
    return this.prisma.grievance.create({
      data: {
        studentId: student.id,
        title,
        description,
      },
    });
  }

  async getMyGrievances(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.grievance.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllGrievances() {
    return this.prisma.grievance.findMany({
      include: {
        student: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.grievance.update({
      where: { id },
      data: { status },
    });
  }
}
