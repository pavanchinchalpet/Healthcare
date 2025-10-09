import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity';
import { CreatePatientInput, UpdatePatientInput } from './dto/patient.input';

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
}
