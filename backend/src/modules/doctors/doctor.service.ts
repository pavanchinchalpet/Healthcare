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

  async bulkCreate(doctors: CreateDoctorInput[]): Promise<Doctor[]> {
    console.log('📦 Bulk creating doctors:', doctors.length);
    const createdDoctors: Doctor[] = [];
    
    for (const doctorData of doctors) {
      try {
        const doctor = this.doctorRepository.create(doctorData);
        const savedDoctor = await this.doctorRepository.save(doctor);
        createdDoctors.push(savedDoctor);
        console.log('✅ Created doctor:', savedDoctor.name);
      } catch (error) {
        console.error('❌ Failed to create doctor:', doctorData.name, error.message);
        throw new Error(`Failed to create doctor ${doctorData.name}: ${error.message}`);
      }
    }
    
    console.log('🎉 Bulk upload completed:', createdDoctors.length, 'doctors created');
    return createdDoctors;
  }
}
