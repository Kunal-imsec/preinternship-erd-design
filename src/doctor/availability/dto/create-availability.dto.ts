import { IsDateString, IsString } from 'class-validator';

export class CreateAvailabilityDto {
    @IsDateString()
    date: string;

    @IsString()
    startTime: string;

    @IsString()
    endTime: string;
}
