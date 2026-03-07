import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreatePaymentDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        const existingPayment = await this.prisma.payment.findUnique({
            where: { appointmentId: dto.appointmentId },
        });

        if (existingPayment) {
            throw new ConflictException('Payment already exists for this appointment.');
        }

        return this.prisma.payment.create({
            data: {
                appointmentId: dto.appointmentId,
                amount: dto.amount,
                paymentMethod: dto.paymentMethod,
            },
        });
    }

    async findByAppointment(appointmentId: number) {
        const payment = await this.prisma.payment.findUnique({
            where: { appointmentId },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found for this appointment.');
        }

        return payment;
    }
}
