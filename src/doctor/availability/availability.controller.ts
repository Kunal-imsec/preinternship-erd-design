import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('doctor/availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }

    @Post()
    createSlot(@Req() req: any, @Body() dto: CreateAvailabilityDto) {
        return this.availabilityService.createSlot(req.user.id, dto);
    }

    @Get()
    getSlots(@Req() req: any) {
        return this.availabilityService.getSlots(req.user.id);
    }

    @Delete(':id')
    deleteSlot(@Param('id') id: string, @Req() req: any) {
        return this.availabilityService.deleteSlot(id, req.user.id);
    }
}
