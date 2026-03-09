import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class SupportService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, dto: CreateTicketDto) {
        return this.prisma.supportTicket.create({
            data: {
                userId,
                issue: dto.issue,
            },
        });
    }

    async findByUser(userId: number) {
        return this.prisma.supportTicket.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
        });
    }
}
