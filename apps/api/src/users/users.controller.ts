import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, NotFoundException, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Prisma, Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('profile')
  async getProfile(@Req() req: any): Promise<any> {
    const user = await this.usersService.user({ id: req.user.sub });
    if (!user) throw new NotFoundException('User not found');
    
    // Also fetch student details if student
    if (user.role === Role.STUDENT) {
      const student = await this.usersService['prisma'].student.findUnique({
        where: { userId: user.id }
      });
      return { ...user, student };
    }
    return user;
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: any): Promise<any> {
    const userId = req.user.sub;
    
    // If the user wants to update their password
    let updatedUser;
    if (body.password) {
      updatedUser = await this.usersService.updateUser({
        where: { id: userId },
        data: { password: body.password }
      });
    }

    // If student wants to update contact number
    if (req.user.role === Role.STUDENT && body.contactNumber) {
      await this.usersService['prisma'].student.update({
        where: { userId },
        data: { contact: body.contactNumber }
      });
    }

    return { success: true };
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Post()
  async createUser(@Body() userData: Prisma.UserCreateInput): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.users({});
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN, Role.WARDEN)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.user({ id });
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSTEL_ADMIN)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.usersService.updateUser({
      where: { id },
      data: userData,
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser({ id });
  }
}
