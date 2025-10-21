import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsIn, Matches } from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  @Field()
  @IsString()
  patientId: string;

  @Field()
  @IsString()
  doctorId: string;

  @Field()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  date: string;

  @Field()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Time must be in HH:MM format' })
  time: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['Scheduled', 'Completed', 'Cancelled', 'In Progress', 'Rescheduled'])
  status?: string;
}

@InputType()
export class UpdateAppointmentInput {
  @Field()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  patientId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Time must be in HH:MM format' })
  time?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['Scheduled', 'Completed', 'Cancelled', 'In Progress', 'Rescheduled'])
  status?: string;
}
