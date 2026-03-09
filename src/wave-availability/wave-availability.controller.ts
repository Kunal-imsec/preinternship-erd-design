import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { WaveAvailabilityService } from './wave-availability.service.js';
import { CreateWaveAvailabilityDto } from './dto/create-wave-availability.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('wave-availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class WaveAvailabilityController {
    constructor(private readonly waveAvailabilityService: WaveAvailabilityService) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateWaveAvailabilityDto) {
        return this.waveAvailabilityService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.waveAvailabilityService.findByDoctor(req.user.id);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.waveAvailabilityService.remove(id, req.user.id);
    }
}
