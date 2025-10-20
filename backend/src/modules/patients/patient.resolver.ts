import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity';
import { CreatePatientInput, UpdatePatientInput } from './dto/patient.input';
import { PatientLoginInput } from './dto/patient-login.input';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient], { name: 'getPatients' })
  async findAll() {
    console.log('🔍 PatientResolver.findAll() called');
    const startTime = Date.now();
    
    try {
      const patients = await this.patientService.findAll();
      const duration = Date.now() - startTime;
      console.log(`✅ PatientResolver.findAll() completed in ${duration}ms`);
      return patients;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PatientResolver.findAll() failed after ${duration}ms:`, error);
      throw error;
    }
  }

  @Query(() => Patient, { name: 'getPatientById' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.patientService.findOne(id);
  }

  @Mutation(() => Patient, { name: 'patientLogin' })
  async login(@Args('loginInput') loginInput: PatientLoginInput) {
    console.log('🔐 PatientResolver.login() called');
    console.log('📧 Login email:', loginInput.email);
    
    try {
      const patient = await this.patientService.login(loginInput);
      console.log('✅ PatientResolver.login() success');
      return patient;
    } catch (error) {
      console.error('❌ PatientResolver.login() error:', error.message);
      throw error;
    }
  }

  @Mutation(() => Patient, { name: 'createPatient' })
  create(@Args('createPatientInput') createPatientInput: CreatePatientInput) {
    console.log('🔥🔥🔥 RESOLVER CALLED - createPatient mutation started 🔥🔥🔥');
    console.log('🚀 PatientResolver.create() called');
    console.log('📝 Input data:', JSON.stringify(createPatientInput, null, 2));
    try {
      const result = this.patientService.create(createPatientInput);
      console.log('✅ PatientResolver.create() success');
      return result;
    } catch (error) {
      console.error('❌ PatientResolver.create() error:', error);
      throw error;
    }
  }

  @Mutation(() => Patient, { name: 'updatePatient' })
  update(@Args('updatePatientInput') updatePatientInput: UpdatePatientInput) {
    return this.patientService.update(updatePatientInput.id, updatePatientInput);
  }

  @Mutation(() => Boolean, { name: 'deletePatient' })
  async remove(@Args('id', { type: () => ID }) id: string) {
    return this.patientService.remove(id);
  }

  @Mutation(() => [Patient], { name: 'bulkCreatePatients' })
  async bulkCreate(@Args('patients', { type: () => [CreatePatientInput] }) patients: CreatePatientInput[]) {
    console.log('🔥 Bulk upload started for patients:', patients.length);
    return this.patientService.bulkCreate(patients);
  }
}
