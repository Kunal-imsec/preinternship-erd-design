import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto.js';

@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) { }

    async book(userId: number, dto: CreateAppointmentDto) {
        // Find the patient record linked to this user
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });

        if (!patient) {
            throw new NotFoundException('Patient profile not found. Please create a patient profile first.');
        }

        // Validate the slot exists and has capacity
        const slot = await this.prisma.timeSlot.findUnique({
            where: { id: dto.slotId },
        });

        if (!slot) {
            throw new NotFoundException('Time slot not found.');
        }

        if (slot.currentCount >= slot.maxPatients) {
            throw new BadRequestException('Slot is fully booked.');
        }

        // Verify doctor exists
        const doctor = await this.prisma.doctor.findUnique({
            where: { doctor_id: dto.doctorId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found.');
        }

        // Create appointment and update slot count in a transaction
        const [appointment] = await this.prisma.$transaction([
            this.prisma.appointment.create({
                data: {
                    userId,
                    doctorId: dto.doctorId,
                    patientId: patient.patient_id,
                    slotId: dto.slotId,
                    appointmentDate: new Date(dto.appointmentDate),
                    consultationType: dto.consultationType,
                    visitType: dto.visitType,
                },
            }),
            this.prisma.timeSlot.update({
                where: { id: dto.slotId },
                data: {
                    currentCount: { increment: 1 },
                    isBooked: slot.currentCount + 1 >= slot.maxPatients,
                },
            }),
        ]);

        return appointment;
    }

    async getMyAppointments(userId: number) {
        return this.prisma.appointment.findMany({
            where: { userId },
            include: {
                doctor: { select: { name: true, specialization: true } },
                slot: { select: { slotTime: true, endTime: true } },
            },
            orderBy: { appointmentDate: 'desc' },
        });
    }

    async getDoctorAppointments(userId: number) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor profile not found.');
        }

        return this.prisma.appointment.findMany({
            where: { doctorId: doctor.doctor_id },
            include: {
                patient: { select: { name: true, age: true, sex: true } },
                slot: { select: { slotTime: true, endTime: true } },
            },
            orderBy: { appointmentDate: 'desc' },
        });
    }

    async cancel(appointmentId: number, userId: number, cancelledBy: string, reason: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        if (appointment.userId !== userId) {
            // Check if the user is the doctor
            const doctor = await this.prisma.doctor.findUnique({
                where: { userId },
            });
            if (!doctor || doctor.doctor_id !== appointment.doctorId) {
                throw new ForbiddenException('You are not authorized to cancel this appointment.');
            }
        }

        if (appointment.status === 'cancelled') {
            throw new BadRequestException('Appointment is already cancelled.');
        }

        // Cancel appointment, create cancellation record, and decrement slot count
        const [updatedAppointment] = await this.prisma.$transaction([
            this.prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: 'cancelled' },
            }),
            this.prisma.cancellation.create({
                data: {
                    appointmentId,
                    cancelledBy,
                    reason,
                },
            }),
            this.prisma.timeSlot.update({
                where: { id: appointment.slotId },
                data: {
                    currentCount: { decrement: 1 },
                    isBooked: false,
                },
            }),
        ]);

        return updatedAppointment;
    }

    async reschedule(appointmentId: number, userId: number, dto: RescheduleAppointmentDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        if (appointment.userId !== userId) {
            const doctor = await this.prisma.doctor.findUnique({
                where: { userId },
            });
            if (!doctor || doctor.doctor_id !== appointment.doctorId) {
                throw new ForbiddenException('You are not authorized to reschedule this appointment.');
            }
        }

        // Validate new slot
        const newSlot = await this.prisma.timeSlot.findUnique({
            where: { id: dto.newSlotId },
        });

        if (!newSlot) {
            throw new NotFoundException('New time slot not found.');
        }

        if (newSlot.currentCount >= newSlot.maxPatients) {
            throw new BadRequestException('New slot is fully booked.');
        }

        const rescheduledBy = appointment.userId === userId ? 'patient' : 'doctor';

        // Reschedule: update appointment, create reschedule record, adjust slot counts
        const [updatedAppointment] = await this.prisma.$transaction([
            this.prisma.appointment.update({
                where: { id: appointmentId },
                data: { slotId: dto.newSlotId },
            }),
            this.prisma.reschedule.create({
                data: {
                    appointmentId,
                    oldSlotId: appointment.slotId,
                    newSlotId: dto.newSlotId,
                    rescheduledBy,
                    reason: dto.reason,
                },
            }),
            // Decrement old slot count
            this.prisma.timeSlot.update({
                where: { id: appointment.slotId },
                data: {
                    currentCount: { decrement: 1 },
                    isBooked: false,
                },
            }),
            // Increment new slot count
            this.prisma.timeSlot.update({
                where: { id: dto.newSlotId },
                data: {
                    currentCount: { increment: 1 },
                    isBooked: newSlot.currentCount + 1 >= newSlot.maxPatients,
                },
            }),
        ]);

        return updatedAppointment;
    }
}
