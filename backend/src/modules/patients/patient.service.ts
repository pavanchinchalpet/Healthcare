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
    console.log('🔐 PatientService.login() called');
    console.log('📧 Login email:', loginInput.email);
    
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
      
      console.log('✅ Patient login successful:', patient.name);
      
      // Remove password from response
      delete patient.password;
      
      return patient;
    } catch (error) {
      console.error('❌ PatientService.login() error:', error.message);
      throw error;
    }
  }

  async create(createPatientInput: CreatePatientInput): Promise<Patient> {
    console.log('🔥🔥🔥 SERVICE CALLED - PatientService.create() started 🔥🔥🔥');
    console.log('💾 PatientService.create() called');
    console.log('📝 Service input:', JSON.stringify(createPatientInput, null, 2));
    
    try {
      console.log('🔨 Creating patient entity...');
      
      // Hash password if provided
      if (createPatientInput.password) {
        const saltRounds = 10;
        createPatientInput.password = await bcrypt.hash(createPatientInput.password, saltRounds);
        console.log('🔐 Password hashed successfully');
      }
      
      const patient = this.patientRepository.create(createPatientInput);
      console.log('📋 Created entity:', JSON.stringify(patient, null, 2));
      
      console.log('💾 Saving to database...');
      const savedPatient = await this.patientRepository.save(patient);
      console.log('✅ Saved patient:', JSON.stringify(savedPatient, null, 2));
      
      // Remove password from response
      delete savedPatient.password;
      
      return savedPatient;
    } catch (error) {
      console.error('❌ PatientService.create() error:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }

  async update(id: string, updatePatientInput: UpdatePatientInput): Promise<Patient> {
    console.log('🔄 PatientService.update() called');
    console.log('📝 Update data:', JSON.stringify(updatePatientInput, null, 2));
    
    try {
      // Hash password if provided
      if (updatePatientInput.password) {
        const saltRounds = 10;
        updatePatientInput.password = await bcrypt.hash(updatePatientInput.password, saltRounds);
        console.log('🔐 Password hashed successfully for update');
      }
      
      await this.patientRepository.update(id, updatePatientInput);
      const updatedPatient = await this.findOne(id);
      
      // Remove password from response
      if (updatedPatient) {
        delete updatedPatient.password;
      }
      
      console.log('✅ Patient updated successfully');
      return updatedPatient;
    } catch (error) {
      console.error('❌ PatientService.update() error:', error);
      throw error;
    }
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

  async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<Patient> {
    console.log('🔄 PatientService.resetPassword() called');
    console.log('📧 Reset email:', resetPasswordInput.email);
    
    try {
      // Find patient by email
      const patient = await this.findByEmail(resetPasswordInput.email);
      if (!patient) {
        throw new Error('Patient not found with this email');
      }
      
      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(resetPasswordInput.newPassword, saltRounds);
      
      // Update the password
      await this.patientRepository.update(patient.id, { password: hashedPassword });
      
      console.log('✅ Password reset successful for:', patient.name);
      
      // Return updated patient without password
      const updatedPatient = await this.findOne(patient.id);
      if (updatedPatient) {
        delete updatedPatient.password;
      }
      
      return updatedPatient;
    } catch (error) {
      console.error('❌ PatientService.resetPassword() error:', error.message);
      throw error;
    }
  }
}
