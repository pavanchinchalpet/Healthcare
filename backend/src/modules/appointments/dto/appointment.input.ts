import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentInput {
  @Field()
  patientId: string;

  @Field()
  doctorId: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  time?: string;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
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
