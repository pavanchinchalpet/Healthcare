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
  id: string;

  @Field({ nullable: true })
  patientId?: string;

  @Field({ nullable: true })
  doctorId?: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  time?: string;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  status?: string;
}
