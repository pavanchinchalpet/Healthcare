import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentInput, UpdateAppointmentInput } from './dto/appointment.input';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor'],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
  }

  async create(createAppointmentInput: CreateAppointmentInput): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(createAppointmentInput);
    const savedAppointment = await this.appointmentRepository.save(appointment);
    return this.findOne(savedAppointment.id);
  }

  async update(id: string, updateAppointmentInput: UpdateAppointmentInput): Promise<Appointment> {
    await this.appointmentRepository.update(id, updateAppointmentInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.appointmentRepository.delete(id);
    return result.affected > 0;
  }
}
