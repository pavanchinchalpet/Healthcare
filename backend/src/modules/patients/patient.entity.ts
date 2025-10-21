import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@Entity('patients')
@ObjectType()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ length: 255 })
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  age?: number;

  @Column({ nullable: true, length: 20 })
  @Field({ nullable: true })
  gender?: string;

  @Column({ nullable: true, unique: true, length: 255 })
  @Field({ nullable: true })
  email?: string;

  @Column({ nullable: true, length: 20 })
  @Field({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;

  @Column({ nullable: true, length: 255 })
  password?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;
}
