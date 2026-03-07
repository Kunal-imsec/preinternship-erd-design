import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
    @IsInt()
    appointmentId: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    review: string;
}
