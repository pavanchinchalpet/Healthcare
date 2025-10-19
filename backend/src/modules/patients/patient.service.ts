import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientInput, UpdatePatientInput } from './dto/patient.input';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async findAll(): Promise<Patient[]> {
    console.log('🔍 PatientService.findAll() called');
    const startTime = Date.now();
    
    try {
      const patients = await this.patientRepository.find({
        order: { createdAt: 'DESC' }
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ PatientService.findAll() completed in ${duration}ms, found ${patients.length} patients`);
      
      return patients;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PatientService.findAll() failed after ${duration}ms:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Patient> {
    return this.patientRepository.findOne({ where: { id } });
  }

  async create(createPatientInput: CreatePatientInput): Promise<Patient> {
    console.log('🔥🔥🔥 SERVICE CALLED - PatientService.create() started 🔥🔥🔥');
    console.log('💾 PatientService.create() called');
    console.log('📝 Service input:', JSON.stringify(createPatientInput, null, 2));
    
    try {
      console.log('🔨 Creating patient entity...');
      const patient = this.patientRepository.create(createPatientInput);
      console.log('📋 Created entity:', JSON.stringify(patient, null, 2));
      
      console.log('💾 Saving to database...');
      const savedPatient = await this.patientRepository.save(patient);
      console.log('✅ Saved patient:', JSON.stringify(savedPatient, null, 2));
      
      return savedPatient;
    } catch (error) {
      console.error('❌ PatientService.create() error:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }

  async update(id: string, updatePatientInput: UpdatePatientInput): Promise<Patient> {
    await this.patientRepository.update(id, updatePatientInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.patientRepository.delete(id);
    return result.affected > 0;
  }

  async bulkCreate(patients: CreatePatientInput[]): Promise<Patient[]> {
    console.log('📦 Bulk creating patients:', patients.length);
    const createdPatients: Patient[] = [];
    
    for (const patientData of patients) {
      try {
        const patient = this.patientRepository.create(patientData);
        const savedPatient = await this.patientRepository.save(patient);
        createdPatients.push(savedPatient);
        console.log('✅ Created patient:', savedPatient.name);
      } catch (error) {
        console.error('❌ Failed to create patient:', patientData.name, error.message);
        throw new Error(`Failed to create patient ${patientData.name}: ${error.message}`);
      }
    }
    
    console.log('🎉 Bulk upload completed:', createdPatients.length, 'patients created');
    return createdPatients;
  }
}
