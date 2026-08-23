import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, RoomAllocation } from '@prisma/client';

@Injectable()
export class AllocationsService {
  constructor(private prisma: PrismaService) {}

  async allocations(params: {
    where?: Prisma.RoomAllocationWhereInput;
  }): Promise<RoomAllocation[]> {
    return this.prisma.roomAllocation.findMany({
      where: params.where,
      include: {
        student: true,
        bed: { include: { room: true } }
      },
    });
  }

  async createAllocation(data: Prisma.RoomAllocationUncheckedCreateInput): Promise<RoomAllocation> {
    // Basic validation to check if bed is already occupied
    const existing = await this.prisma.roomAllocation.findFirst({
      where: { bedId: data.bedId, status: 'ACTIVE' },
    });
    if (existing) {
      throw new BadRequestException('Bed is already occupied.');
    }
    return this.prisma.roomAllocation.create({
      data,
    });
  }
}
