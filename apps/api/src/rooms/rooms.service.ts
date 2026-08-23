import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.room.findMany({
      include: {
        floor: {
          include: {
            block: {
              include: {
                hostel: true,
              },
            },
          },
        },
      },
      orderBy: [
        { floor: { block: { hostel: { name: 'asc' } } } },
        { floor: { block: { name: 'asc' } } },
        { floor: { number: 'asc' } },
        { number: 'asc' },
      ],
    });
  }

  async createRoom(data: any) {
    try {
      if (!data.floorId) {
        // Find a default floor if none provided
        const firstFloor = await this.prisma.floor.findFirst();
        if (!firstFloor) {
          throw new BadRequestException('No floors exist in the database. Please create a hostel/block/floor first.');
        }
        data.floorId = firstFloor.id;
      } else {
        // Validate provided floorId
        const floor = await this.prisma.floor.findUnique({ where: { id: data.floorId } });
        if (!floor) {
          throw new BadRequestException('The provided Floor ID does not exist in the database. Please leave it blank to auto-assign, or enter a valid ID.');
        }
      }
      
      return await this.prisma.room.create({
        data,
      });
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to create room. Please ensure the Floor ID is a valid UUID.');
    }
  }

  async updateRoom(id: string, data: any) {
    try {
      if (!data.floorId) {
        delete data.floorId;
      }
      return await this.prisma.room.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      throw new BadRequestException('Failed to update room. Please ensure the Floor ID is a valid UUID.');
    }
  }
}
