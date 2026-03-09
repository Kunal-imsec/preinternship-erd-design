import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsInt()
    appointmentId: number;

    @IsNumber()
    amount: number;

    @IsString()
    paymentMethod: string;
}
