import { IsString, IsInt, Min } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    specialization: string;

    @IsString()
    qualification: string;

    @IsInt()
    @Min(0)
    experience: number;

    @IsString()
    phone: string;
}
