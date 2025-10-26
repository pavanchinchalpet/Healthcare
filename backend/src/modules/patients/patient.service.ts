import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Patient } from './patient.entity';
import { CreatePatientInput, UpdatePatientInput, ResetPasswordInput } from './dto/patient.input';
import { PatientLoginInput } from './dto/patient-login.input';

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

  async findByEmail(email: string): Promise<Patient> {
    return this.patientRepository.findOne({ where: { email } });
  }

  async login(loginInput: PatientLoginInput): Promise<Patient> {
    const startTime = Date.now();
    
    try {
      // Find patient by email
      const patient = await this.findByEmail(loginInput.email);
      if (!patient) {
        throw new Error('Patient not found with this email');
      }
      
      // Check if patient has a password set
      if (!patient.password) {
        throw new Error('No password set for this patient. Please contact support.');
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(loginInput.password, patient.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      // Remove password from response
      delete patient.password;
      
      const duration = Date.now() - startTime;
      console.log(`✅ Patient login successful in ${duration}ms: ${patient.name}`);
      
      return patient;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PatientService.login() failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  async create(createPatientInput: CreatePatientInput): Promise<Patient> {
    const startTime = Date.now();
    
    try {
      // Hash password if provided
      if (createPatientInput.password) {
        const saltRounds = 8; // Reduced from 10 to 8 for better performance (still secure)
        createPatientInput.password = await bcrypt.hash(createPatientInput.password, saltRounds);
      }
      
      const patient = this.patientRepository.create(createPatientInput);
      const savedPatient = await this.patientRepository.save(patient);
      
      // Remove password from response
      delete savedPatient.password;
      
      const duration = Date.now() - startTime;
      console.log(`✅ Patient created successfully in ${duration}ms: ${savedPatient.name}`);
      
      return savedPatient;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PatientService.create() failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  async update(id: string, updatePatientInput: UpdatePatientInput): Promise<Patient> {
    const startTime = Date.now();
    
    try {
      // Hash password if provided
      if (updatePatientInput.password) {
        const saltRounds = 8;
        updatePatientInput.password = await bcrypt.hash(updatePatientInput.password, saltRounds);
      }
      
      await this.patientRepository.update(id, updatePatientInput);
      const updatedPatient = await this.findOne(id);
      
      // Remove password from response
      if (updatedPatient) {
        delete updatedPatient.password;
      }
      
      const duration = Date.now() - startTime;
      console.log(`✅ Patient updated successfully in ${duration}ms`);
      return updatedPatient;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PatientService.update() failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.patientRepository.delete(id);
    return result.affected > 0;
  }

  async bulkCreate(patients: CreatePatientInput[]): Promise<Patient[]> {
    const startTime = Date.now();
    const createdPatients: Patient[] = [];
    
    for (const patientData of patients) {
      try {
        // Hash password if provided
        if (patientData.password) {
          const saltRounds = 8;
          patientData.password = await bcrypt.hash(patientData.password, saltRounds);
        }
        
        const patient = this.patientRepository.create(patientData);
        const savedPatient = await this.patientRepository.save(patient);
        createdPatients.push(savedPatient);
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Bulk create failed after ${duration}ms:`, error.message);
        throw new Error(`Failed to create patient ${patientData.name}: ${error.message}`);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Bulk upload completed in ${duration}ms: ${createdPatients.length} patients created`);
    return createdPatients;
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<Patient> {
    const startTime = Date.now();
    
    try {
      // Find patient by email
      const patient = await this.findByEmail(resetPasswordInput.email);
      if (!patient) {
        throw new Error('Patient not found with this email');
      }
      
      // Hash the new password
      const saltRounds = 8;
      const hashedPassword = await bcrypt.hash(resetPasswordInput.newPassword, saltRounds);
      
      // Update the password
      await this.patientRepository.update(patient.id, { password: hashedPassword });
      
      // Return updated patient without password
      const updatedPatient = await this.findOne(patient.id);
      if (updatedPatient) {
        delete updatedPatient.password;
      }
      
      const duration = Date.now() - startTime;
      console.log(`✅ Password reset successful in ${duration}ms for: ${patient.name}`);
      
      return updatedPatient;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PatientService.resetPassword() failed after ${duration}ms:`, error.message);
      throw error;
    }
  }
}
