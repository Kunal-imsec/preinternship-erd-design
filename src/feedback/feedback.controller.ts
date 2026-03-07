import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service.js';
import { CreateFeedbackDto } from './dto/create-feedback.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.PATIENT)
    create(@Req() req: any, @Body() dto: CreateFeedbackDto) {
        return this.feedbackService.create(req.user.id, dto);
    }

    @Get('doctor/:doctorId')
    findByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number) {
        return this.feedbackService.findByDoctor(doctorId);
    }
}
