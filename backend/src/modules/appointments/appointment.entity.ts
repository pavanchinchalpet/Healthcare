import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Patient } from '../patients/patient.entity';
import { Doctor } from '../doctors/doctor.entity';

@Entity('appointments')
@ObjectType()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'patient_id' })
  @Field()
  patientId: string;

  @Column({ name: 'doctor_id' })
  @Field()
  doctorId: string;

  @Column({ name: 'date', nullable: true })
  @Field({ nullable: true })
  date?: string;

  @Column({ name: 'time', nullable: true })
  @Field({ nullable: true })
  time?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  reason?: string;

  @Column({ nullable: true, default: 'Scheduled' })
  @Field({ nullable: true })
  status?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Patient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  @Field(() => Patient)
  patient: Patient;

  @ManyToOne(() => Doctor, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  @Field(() => Doctor)
  doctor: Doctor;
}
