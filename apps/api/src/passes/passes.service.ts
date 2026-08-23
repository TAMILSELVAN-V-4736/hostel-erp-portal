import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePassDto, UpdatePassStatusDto } from './dto/pass.dto';

@Injectable()
export class PassesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPassDto: CreatePassDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.gatePass.create({
      data: {
        studentId: student.id,
        exitTime: new Date(createPassDto.exitTime),
        expectedReturnTime: new Date(createPassDto.expectedReturnTime),
        reason: createPassDto.reason,
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

    return this.prisma.gatePass.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      include: { approvedBy: { select: { email: true } } },
    });
  }

  async findAll() {
    return this.prisma.gatePass.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, studentId: true } },
        approvedBy: { select: { email: true } },
      },
    });
  }

  async updateStatus(id: string, userId: string, updateDto: UpdatePassStatusDto) {
    return this.prisma.gatePass.update({
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
