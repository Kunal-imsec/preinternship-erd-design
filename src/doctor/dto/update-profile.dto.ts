import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    specialization?: string;

    @IsString()
    @IsOptional()
    qualification?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    experience?: number;

    @IsString()
    @IsOptional()
    phone?: string;
}
