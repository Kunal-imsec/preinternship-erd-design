import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EmailModule } from './email/email.module.js';
import { DoctorModule } from './doctor/doctor.module.js';
import { WaveAvailabilityModule } from './wave-availability/wave-availability.module.js';
import { SlotsModule } from './slots/slots.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { FeedbackModule } from './feedback/feedback.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { SupportModule } from './support/support.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EmailModule,
    DoctorModule,
    WaveAvailabilityModule,
    SlotsModule,
    AppointmentsModule,
    PaymentsModule,
    FeedbackModule,
    NotificationsModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

