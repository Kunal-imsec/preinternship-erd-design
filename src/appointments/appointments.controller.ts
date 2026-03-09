import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.PATIENT)
    book(@Req() req: any, @Body() dto: CreateAppointmentDto) {
        return this.appointmentsService.book(req.user.id, dto);
    }

    @Get('my')
    @UseGuards(RolesGuard)
    @Roles(Role.PATIENT)
    getMyAppointments(@Req() req: any) {
        return this.appointmentsService.getMyAppointments(req.user.id);
    }

    @Get('doctor')
    @UseGuards(RolesGuard)
    @Roles(Role.DOCTOR)
    getDoctorAppointments(@Req() req: any) {
        return this.appointmentsService.getDoctorAppointments(req.user.id);
    }

    @Patch(':id/cancel')
    cancel(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body('cancelledBy') cancelledBy: string,
        @Body('reason') reason: string,
    ) {
        return this.appointmentsService.cancel(id, req.user.id, cancelledBy, reason);
    }

    @Patch(':id/reschedule')
    reschedule(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body() dto: RescheduleAppointmentDto,
    ) {
        return this.appointmentsService.reschedule(id, req.user.id, dto);
    }
}
