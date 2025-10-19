import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { PatientModule } from './modules/patients/patient.module';
import { DoctorModule } from './modules/doctors/doctor.module';
import { AppointmentModule } from './modules/appointments/appointment.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    DatabaseModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
  ],
})
export class AppModule {}
