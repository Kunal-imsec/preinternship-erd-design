import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class DoctorService {
    constructor(private readonly prisma: PrismaService) { }

    async createProfile(userId: number, dto: CreateProfileDto) {
        // Doctor record is auto-created on signup, so we update it with profile details
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor record not found. Please sign up as a doctor first.');
        }

        return this.prisma.doctor.update({
            where: { userId },
            data: {
                specialization: dto.specialization,
                qualification: dto.qualification,
                experience: dto.experience,
                phone: dto.phone,
            },
        });
    }

    async getProfile(userId: number) {
        const profile = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Doctor profile not found');
        }

        return profile;
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const profile = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Doctor profile not found');
        }

        return this.prisma.doctor.update({
            where: { userId },
            data: dto,
        });
    }
}
