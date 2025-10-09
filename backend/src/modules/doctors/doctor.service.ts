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
    console.log('🔍 DoctorService.findAll() called');
    const startTime = Date.now();
    
    try {
      const doctors = await this.doctorRepository.find({
        order: { createdAt: 'DESC' }
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ DoctorService.findAll() completed in ${duration}ms, found ${doctors.length} doctors`);
      
      return doctors;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ DoctorService.findAll() failed after ${duration}ms:`, error);
      throw error;
    }
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
