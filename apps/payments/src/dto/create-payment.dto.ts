//create create-payment.dto.ts use create-charge and email to do

import { CreateChargeDto } from '@app/common';
import { IsEmail } from 'class-validator';

export class CreatePaymentDto extends CreateChargeDto {
  @IsEmail()
  email!: string;
}
