import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWaveAvailabilityDto } from './dto/create-wave-availability.dto.js';

@Injectable()
export class WaveAvailabilityService {
    constructor(private readonly prisma: PrismaService) { }

    async create(doctorId: number, dto: CreateWaveAvailabilityDto) {
        // Find the Doctor record linked to this user
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: doctorId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor profile not found. Please create a doctor profile first.');
        }

        // Create the wave availability record
        const availability = await this.prisma.waveAvailability.create({
            data: {
                doctorId: doctor.doctor_id,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
            },
        });

        // Auto-generate 30-minute time slots
        const maxPatients = dto.maxPatients ?? 10;
        const slots = this.generateTimeSlots(dto.startTime, dto.endTime, maxPatients);

        const createdSlots = await Promise.all(
            slots.map((slot) =>
                this.prisma.timeSlot.create({
                    data: {
                        availabilityId: availability.id,
                        slotTime: slot.startTime,
                        endTime: slot.endTime,
                        maxPatients: slot.maxPatients,
                        currentCount: 0,
                        isBooked: false,
                    },
                }),
            ),
        );

        return {
            availability,
            generatedSlots: createdSlots.map((s) => ({
                id: s.id,
                startTime: s.slotTime,
                endTime: s.endTime,
                maxPatients: s.maxPatients,
            })),
        };
    }

    async findByDoctor(userId: number) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor profile not found.');
        }

        return this.prisma.waveAvailability.findMany({
            where: { doctorId: doctor.doctor_id },
            include: { timeSlots: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(id: number, userId: number) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor profile not found.');
        }

        const availability = await this.prisma.waveAvailability.findUnique({
            where: { id },
        });

        if (!availability) {
            throw new NotFoundException('Wave availability not found.');
        }

        if (availability.doctorId !== doctor.doctor_id) {
            throw new ForbiddenException('This availability does not belong to you.');
        }

        // Cascade delete: first delete all time slots, then the availability
        await this.prisma.timeSlot.deleteMany({
            where: { availabilityId: id },
        });

        return this.prisma.waveAvailability.delete({
            where: { id },
        });
    }

    private generateTimeSlots(
        startTime: string,
        endTime: string,
        maxPatients: number,
    ) {
        const slots: { startTime: string; endTime: string; maxPatients: number }[] = [];

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        let currentMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        while (currentMinutes + 30 <= endMinutes) {
            const slotStartH = Math.floor(currentMinutes / 60);
            const slotStartM = currentMinutes % 60;
            const slotEndMinutes = currentMinutes + 30;
            const slotEndH = Math.floor(slotEndMinutes / 60);
            const slotEndM = slotEndMinutes % 60;

            slots.push({
                startTime: `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`,
                endTime: `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`,
                maxPatients,
            });

            currentMinutes = slotEndMinutes;
        }

        return slots;
    }
}
