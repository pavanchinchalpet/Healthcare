import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@Entity('doctors')
@ObjectType()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  specialization?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ name: 'experience', nullable: true })
  @Field(() => Int, { nullable: true })
  experience?: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;
}
