import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorInput, UpdateDoctorInput } from './dto/doctor.input';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  async findOne(id: string): Promise<Doctor> {
    return this.doctorRepository.findOne({ where: { id } });
  }

  async create(createDoctorInput: CreateDoctorInput): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorInput);
    return this.doctorRepository.save(doctor);
  }

  async update(id: string, updateDoctorInput: UpdateDoctorInput): Promise<Doctor> {
    await this.doctorRepository.update(id, updateDoctorInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.doctorRepository.delete(id);
    return result.affected > 0;
  }
}
