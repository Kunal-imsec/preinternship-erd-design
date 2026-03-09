import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
    @IsInt()
    doctorId: number;

    @IsInt()
    slotId: number;

    @IsDateString()
    appointmentDate: string;

    @IsString()
    consultationType: string;

    @IsString()
    visitType: string;
}
