import { IsNumber, IsObject } from 'class-validator';
import Stripe from 'stripe';

export class CreateChargeDto {
  @IsObject()
  card!: Stripe.PaymentMethodCreateParams.Card;

  @IsNumber()
  amount!: number;
}   