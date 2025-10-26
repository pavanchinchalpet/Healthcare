import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity';
import { CreatePatientInput, UpdatePatientInput, ResetPasswordInput } from './dto/patient.input';
import { PatientLoginInput } from './dto/patient-login.input';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient], { name: 'getPatients' })
  findAll() {
    return this.patientService.findAll();
  }

  @Query(() => Patient, { name: 'getPatientById' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.patientService.findOne(id);
  }

  @Mutation(() => Patient, { name: 'patientLogin' })
  login(@Args('loginInput') loginInput: PatientLoginInput) {
    return this.patientService.login(loginInput);
  }

  @Mutation(() => Patient, { name: 'createPatient' })
  create(@Args('createPatientInput') createPatientInput: CreatePatientInput) {
    return this.patientService.create(createPatientInput);
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
  bulkCreate(@Args('patients', { type: () => [CreatePatientInput] }) patients: CreatePatientInput[]) {
    return this.patientService.bulkCreate(patients);
  }

  @Mutation(() => Patient, { name: 'resetPatientPassword' })
  resetPassword(@Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput) {
    return this.patientService.resetPassword(resetPasswordInput);
  }
}
