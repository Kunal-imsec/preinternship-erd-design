import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFeedbackDto } from './dto/create-feedback.dto.js';

@Injectable()
export class FeedbackService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, dto: CreateFeedbackDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        if (appointment.userId !== userId) {
            throw new ForbiddenException('You can only leave feedback for your own appointments.');
        }

        const existingFeedback = await this.prisma.feedback.findUnique({
            where: { appointmentId: dto.appointmentId },
        });

        if (existingFeedback) {
            throw new ConflictException('Feedback already submitted for this appointment.');
        }

        return this.prisma.feedback.create({
            data: {
                appointmentId: dto.appointmentId,
                rating: dto.rating,
                review: dto.review,
            },
        });
    }

    async findByDoctor(doctorId: number) {
        return this.prisma.feedback.findMany({
            where: {
                appointment: {
                    doctorId,
                },
            },
            include: {
                appointment: {
                    select: {
                        appointmentDate: true,
                        patient: { select: { name: true } },
                    },
                },
            },
            orderBy: { id: 'desc' },
        });
    }
}
