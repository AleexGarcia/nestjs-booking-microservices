import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import Stripe from 'stripe';
import { CreateChargeDto } from './dto/create-charge';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  
  constructor(private readonly configService: ConfigService) { 
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_API_KEY'),{
      apiVersion: '2026-07-29.dahlia'
    });
  }

  async createCharge({ card, amount }: CreateChargeDto): Promise<Stripe.PaymentIntent> {
    const paymentMethod = await this.stripe.paymentMethods.create(
      {
        type: 'card',
        card,
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
