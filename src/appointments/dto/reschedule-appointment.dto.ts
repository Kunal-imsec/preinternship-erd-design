import { IsInt, IsString } from 'class-validator';

export class RescheduleAppointmentDto {
    @IsInt()
    newSlotId: number;

    @IsString()
    reason: string;
}
