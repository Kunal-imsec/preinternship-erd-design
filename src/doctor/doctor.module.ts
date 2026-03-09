import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller.js';
import { DoctorService } from './doctor.service.js';

@Module({
    controllers: [DoctorController],
    providers: [DoctorService],
})
export class DoctorModule { }
