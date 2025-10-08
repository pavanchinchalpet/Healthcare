import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment.resolver';
import { Appointment } from './appointment.entity';
import { Patient } from '../patients/patient.entity';
import { Doctor } from '../doctors/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Doctor]),
  ],
  providers: [AppointmentService, AppointmentResolver],
  exports: [AppointmentService],
})
export class AppointmentModule {}
