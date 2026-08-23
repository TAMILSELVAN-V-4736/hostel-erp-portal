import { RequestStatus } from '@prisma/client';
import { IsNotEmpty, IsDateString, IsString, IsEnum } from 'class-validator';

export class CreatePassDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Exit time is required' })
  exitTime: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Expected return time is required' })
  expectedReturnTime: string;

  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason: string;
}

export class UpdatePassStatusDto {
  @IsEnum(RequestStatus)
  @IsNotEmpty()
  status: RequestStatus;
}
