import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student, Prisma, Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('students')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Post()
  async createStudent(@Body() studentData: Prisma.StudentCreateInput): Promise<Student> {
    return this.studentsService.createStudent(studentData);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN, Role.SECURITY)
  @Get()
  async getAllStudents(): Promise<Student[]> {
    return this.studentsService.students({});
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN, Role.SECURITY)
  @Get(':id')
  async getStudentById(@Param('id') id: string): Promise<Student | null> {
    return this.studentsService.student({ id });
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() studentData: Prisma.StudentUpdateInput,
  ): Promise<Student> {
    return this.studentsService.updateStudent({
      where: { id },
      data: studentData,
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async deleteStudent(@Param('id') id: string): Promise<Student> {
    return this.studentsService.deleteStudent({ id });
  }
}
