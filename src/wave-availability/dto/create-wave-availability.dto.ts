import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateWaveAvailabilityDto {
    @IsString()
    dayOfWeek: string;

    @IsString()
    startTime: string;

    @IsString()
    endTime: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxPatients?: number;
}
