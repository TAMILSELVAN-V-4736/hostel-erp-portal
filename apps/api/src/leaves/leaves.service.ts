import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLeaveDto, UpdateLeaveStatusDto } from './dto/leave.dto';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createLeaveDto: CreateLeaveDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.leaveRequest.create({
      data: {
        studentId: student.id,
        startDate: new Date(createLeaveDto.startDate),
        endDate: new Date(createLeaveDto.endDate),
        reason: createLeaveDto.reason,
      },
    });
  }

  async findAllForStudent(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.leaveRequest.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      include: { approvedBy: { select: { email: true } } },
    });
  }

  async findAll() {
    return this.prisma.leaveRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, studentId: true } },
        approvedBy: { select: { email: true } },
      },
    });
  }

  async updateStatus(id: string, userId: string, updateDto: UpdateLeaveStatusDto) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: updateDto.status,
        approvedById: updateDto.status === 'APPROVED' || updateDto.status === 'REJECTED' ? userId : null,
      },
      include: {
        student: { select: { name: true, studentId: true } },
      }
    });
  }
}
