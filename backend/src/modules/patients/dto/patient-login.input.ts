import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PatientLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
