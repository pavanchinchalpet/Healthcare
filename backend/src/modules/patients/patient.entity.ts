import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@Entity('patients')
@ObjectType()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  age?: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;
}
