import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';

@Injectable()
export class AvailabilityService {
    constructor(private readonly prisma: PrismaService) { }

    async createSlot(doctorId: number, dto: CreateAvailabilityDto) {
        return this.prisma.availability.create({
            data: {
                doctorId,
                date: new Date(dto.date),
                startTime: dto.startTime,
                endTime: dto.endTime,
            },
        });
    }

    async getSlots(doctorId: number) {
        return this.prisma.availability.findMany({
            where: { doctorId },
            orderBy: { date: 'asc' },
        });
    }

    async deleteSlot(slotId: string, doctorId: number) {
        const slot = await this.prisma.availability.findUnique({
            where: { id: slotId },
        });

        if (!slot) {
            throw new NotFoundException('Availability slot not found');
        }

        if (slot.doctorId !== doctorId) {
            throw new ForbiddenException('This slot does not belong to you');
        }

        return this.prisma.availability.delete({
            where: { id: slotId },
        });
    }
}
