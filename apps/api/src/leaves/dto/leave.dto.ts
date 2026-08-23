import { RequestStatus } from '@prisma/client';
import { IsNotEmpty, IsDateString, IsString, IsEnum } from 'class-validator';

export class CreateLeaveDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason: string;
}

export class UpdateLeaveStatusDto {
  @IsEnum(RequestStatus)
  @IsNotEmpty()
  status: RequestStatus;
}
