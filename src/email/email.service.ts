import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async sendVerificationEmail(to: string, token: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.configService.get<string>('SMTP_FROM'),
            to,
            subject: 'Verify your email',
            html: `<p>Click the link to verify your email:</p>
             <a href="http://localhost:3000/auth/verify?token=${token}">Verify Email</a>`,
        });
    }

    async sendNotificationEmail(to: string, message: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.configService.get<string>('SMTP_FROM'),
            to,
            subject: 'Notification',
            html: `<p>${message}</p>`,
        });
    }
}
