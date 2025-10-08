import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePatientInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;
}

@InputType()
export class UpdatePatientInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;
}
