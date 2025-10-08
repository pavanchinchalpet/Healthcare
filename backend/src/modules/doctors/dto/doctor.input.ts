import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDoctorInput {
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
