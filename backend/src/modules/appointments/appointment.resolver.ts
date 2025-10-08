import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { CreateAppointmentInput, UpdateAppointmentInput } from './dto/appointment.input';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Query(() => [Appointment], { name: 'getAppointments' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Query(() => Appointment, { name: 'getAppointmentById' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.findOne(id);
  }

  @Mutation(() => Appointment, { name: 'createAppointment' })
  create(@Args('createAppointmentInput') createAppointmentInput: CreateAppointmentInput) {
    return this.appointmentService.create(createAppointmentInput);
  }

  @Mutation(() => Appointment, { name: 'updateAppointment' })
  update(@Args('updateAppointmentInput') updateAppointmentInput: UpdateAppointmentInput) {
    return this.appointmentService.update(updateAppointmentInput.id, updateAppointmentInput);
  }

  @Mutation(() => Boolean, { name: 'deleteAppointment' })
  async remove(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.remove(id);
  }
}
