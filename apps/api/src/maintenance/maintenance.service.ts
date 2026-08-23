import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MaintenanceCategory, RequestStatus } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: { title: string; description: string; category: MaintenanceCategory }) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    return this.prisma.maintenanceRequest.create({
      data: {
        studentId: student.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: RequestStatus.PENDING,
      },
    });
  }

  async getMyRequests(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) return [];

    return this.prisma.maintenanceRequest.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { email: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.maintenanceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, studentId: true } },
        assignedTo: { select: { email: true } },
      },
    });
  }

  async updateStatus(id: string, status: RequestStatus, assignedToId?: string) {
    return this.prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status,
        ...(assignedToId && { assignedToId }),
      },
      include: {
        student: { select: { name: true, studentId: true } },
      }
    });
  }
}
