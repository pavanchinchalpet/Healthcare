import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsInt, Min, Max } from 'class-validator';

@InputType()
export class CreateDoctorInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  specialization?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  experience?: number;
}

@InputType()
export class UpdateDoctorInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  specialization?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => Int, { nullable: true })
  experience?: number;
}
