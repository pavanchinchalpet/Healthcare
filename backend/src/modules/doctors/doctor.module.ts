import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { Doctor } from './doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  providers: [DoctorService, DoctorResolver],
  exports: [DoctorService],
})
export class DoctorModule {}
