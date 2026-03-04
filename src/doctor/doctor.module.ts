import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller.js';
import { DoctorService } from './doctor.service.js';
import { AvailabilityController } from './availability/availability.controller.js';
import { AvailabilityService } from './availability/availability.service.js';

@Module({
    controllers: [DoctorController, AvailabilityController],
    providers: [DoctorService, AvailabilityService],
})
export class DoctorModule { }
