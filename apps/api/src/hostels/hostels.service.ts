import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Hostel } from '@prisma/client';

@Injectable()
export class HostelsService {
  constructor(private prisma: PrismaService) {}

  async hostel(
    hostelWhereUniqueInput: Prisma.HostelWhereUniqueInput,
  ): Promise<Hostel | null> {
    return this.prisma.hostel.findUnique({
      where: hostelWhereUniqueInput,
      include: {
        blocks: {
          include: {
            floors: {
              include: {
                rooms: {
                  include: {
                    beds: {
                      include: {
                        allocations: { where: { status: 'ACTIVE' } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async hostels(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.HostelWhereUniqueInput;
    where?: Prisma.HostelWhereInput;
    orderBy?: Prisma.HostelOrderByWithRelationInput;
  }): Promise<Hostel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.hostel.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createHostel(data: Prisma.HostelCreateInput): Promise<Hostel> {
    return this.prisma.hostel.create({
      data,
    });
  }
}
