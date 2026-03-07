import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SlotsService {
    constructor(private readonly prisma: PrismaService) { }

    async findByAvailability(availabilityId: number) {
        const availability = await this.prisma.waveAvailability.findUnique({
            where: { id: availabilityId },
        });

        if (!availability) {
            throw new NotFoundException('Wave availability not found.');
        }

        return this.prisma.timeSlot.findMany({
            where: { availabilityId },
            orderBy: { slotTime: 'asc' },
        });
    }

    async findAvailableByDoctor(doctorId: number) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { doctor_id: doctorId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found.');
        }

        return this.prisma.timeSlot.findMany({
            where: {
                availability: {
                    doctorId,
                },
                isBooked: false,
            },
            orderBy: { slotTime: 'asc' },
            include: {
                availability: {
                    select: {
                        dayOfWeek: true,
                        startTime: true,
                        endTime: true,
                    },
                },
            },
        });
    }
}
