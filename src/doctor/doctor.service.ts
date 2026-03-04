import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class DoctorService {
    constructor(private readonly prisma: PrismaService) { }

    async createProfile(userId: number, dto: CreateProfileDto) {
        const existing = await this.prisma.doctorProfile.findUnique({
            where: { userId },
        });

        if (existing) {
            throw new ConflictException('Doctor profile already exists');
        }

        return this.prisma.doctorProfile.create({
            data: {
                userId,
                specialization: dto.specialization,
                qualification: dto.qualification,
                experience: dto.experience,
                phone: dto.phone,
            },
        });
    }

    async getProfile(userId: number) {
        const profile = await this.prisma.doctorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Doctor profile not found');
        }

        return profile;
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const profile = await this.prisma.doctorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Doctor profile not found');
        }

        return this.prisma.doctorProfile.update({
            where: { userId },
            data: dto,
        });
    }
}
