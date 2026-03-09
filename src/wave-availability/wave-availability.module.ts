import { Module } from '@nestjs/common';
import { WaveAvailabilityController } from './wave-availability.controller.js';
import { WaveAvailabilityService } from './wave-availability.service.js';

@Module({
    controllers: [WaveAvailabilityController],
    providers: [WaveAvailabilityService],
})
export class WaveAvailabilityModule { }
