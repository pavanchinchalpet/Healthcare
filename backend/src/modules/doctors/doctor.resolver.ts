import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';
import { CreateDoctorInput, UpdateDoctorInput } from './dto/doctor.input';

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Query(() => [Doctor], { name: 'getDoctors' })
  async findAll() {
    console.log('🔍 DoctorResolver.findAll() called');
    const startTime = Date.now();
    
    try {
      const doctors = await this.doctorService.findAll();
      const duration = Date.now() - startTime;
      console.log(`✅ DoctorResolver.findAll() completed in ${duration}ms`);
      return doctors;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ DoctorResolver.findAll() failed after ${duration}ms:`, error);
      throw error;
    }
  }

  @Query(() => Doctor, { name: 'getDoctorById' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.doctorService.findOne(id);
  }

  @Mutation(() => Doctor, { name: 'createDoctor' })
  create(@Args('createDoctorInput') createDoctorInput: CreateDoctorInput) {
    return this.doctorService.create(createDoctorInput);
  }

  @Mutation(() => Doctor, { name: 'updateDoctor' })
  update(@Args('updateDoctorInput') updateDoctorInput: UpdateDoctorInput) {
    return this.doctorService.update(updateDoctorInput.id, updateDoctorInput);
  }

  @Mutation(() => Boolean, { name: 'deleteDoctor' })
  async remove(@Args('id', { type: () => ID }) id: string) {
    return this.doctorService.remove(id);
  }

  @Mutation(() => [Doctor], { name: 'bulkCreateDoctors' })
  async bulkCreate(@Args('doctors', { type: () => [CreateDoctorInput] }) doctors: CreateDoctorInput[]) {
    console.log('🔥 Bulk upload started for doctors:', doctors.length);
    return this.doctorService.bulkCreate(doctors);
  }
}
