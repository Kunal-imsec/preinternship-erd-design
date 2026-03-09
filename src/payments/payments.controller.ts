import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    create(@Body() dto: CreatePaymentDto) {
        return this.paymentsService.create(dto);
    }

    @Get(':appointmentId')
    findByAppointment(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
        return this.paymentsService.findByAppointment(appointmentId);
    }
}
