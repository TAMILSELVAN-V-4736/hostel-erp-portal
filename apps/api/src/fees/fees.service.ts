import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FeeType } from '@prisma/client';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyFees(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');
    return this.prisma.feeRecord.findMany({
      where: { studentId: student.id },
      orderBy: { dueDate: 'asc' },
    });
  }

  async payFee(feeId: string, userId: string) {
    // In a real app, this would verify payment gateway webhook
    // We simulate a successful payment
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.feeRecord.update({
      where: { id: feeId, studentId: student.id },
      data: {
        status: 'PAID',
        paidDate: new Date(),
      },
    });
  }

  async getAllFees() {
    return this.prisma.feeRecord.findMany({
      include: {
        student: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async generateFee(studentId: string, amount: number, type: string, dueDate: string) {
    return this.prisma.feeRecord.create({
      data: {
        studentId,
        amount,
        type: type as FeeType,
        status: 'PENDING',
        dueDate: new Date(dueDate),
      },
    });
  }
}
