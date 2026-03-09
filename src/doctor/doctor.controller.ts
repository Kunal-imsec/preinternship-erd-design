import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { DoctorService } from './doctor.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorController {
    constructor(private readonly doctorService: DoctorService) { }

    @Post('profile')
    createProfile(@Req() req: any, @Body() dto: CreateProfileDto) {
        return this.doctorService.createProfile(req.user.id, dto);
    }

    @Get('profile')
    getProfile(@Req() req: any) {
        return this.doctorService.getProfile(req.user.id);
    }

    @Patch('profile')
    updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.doctorService.updateProfile(req.user.id, dto);
    }
}
