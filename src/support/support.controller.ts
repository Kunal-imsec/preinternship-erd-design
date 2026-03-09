import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { SupportService } from './support.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateTicketDto) {
        return this.supportService.create(req.user.id, dto);
    }

    @Get('my')
    findMy(@Req() req: any) {
        return this.supportService.findByUser(req.user.id);
    }
}
