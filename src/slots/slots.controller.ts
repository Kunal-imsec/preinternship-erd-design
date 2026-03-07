import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotsController {
    constructor(private readonly slotsService: SlotsService) { }

    @Get(':availabilityId')
    findByAvailability(@Param('availabilityId', ParseIntPipe) availabilityId: number) {
        return this.slotsService.findByAvailability(availabilityId);
    }

    @Get('doctor/:doctorId')
    findAvailableByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number) {
        return this.slotsService.findAvailableByDoctor(doctorId);
    }
}
