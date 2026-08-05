import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  
  constructor(private readonly configService: ConfigService) { 
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),{
      apiVersion: '2026-07-29.dahlia'
    });
  }

  async createCharge({ card, amount }: CreateChargeDto): Promise<Stripe.PaymentIntent> {
    //just for testing purposes, in a real application we recieve the paymentmethodID from front-end.
    const paymentMethod = await this.stripe.paymentMethods.create(
      {
        type: 'card',
        card: {token: 'tok_visa'},
      },
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, 
      confirm: true,
      currency: 'usd',
      payment_method: paymentMethod.id,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }



}
