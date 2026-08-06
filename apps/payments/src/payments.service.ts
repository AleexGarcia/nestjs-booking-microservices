import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy
  ) {
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-07-29.dahlia'
    });
  }

  async createCharge(createPaymentDto: CreatePaymentDto): Promise<Stripe.PaymentIntent> {
    //just for testing purposes, in a real application we recieve the paymentmethodID from front-end.
    const paymentMethod = await this.stripe.paymentMethods.create(
      {
        type: 'card',
        card: { token: 'tok_visa' },
      },
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: createPaymentDto.amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: paymentMethod.id,
      payment_method_types: ['card'],
    });

    this.notificationsClient.emit('sendNotification', {
      email: createPaymentDto.email,
      message: 'A new payment has been processed.'
    });


    return paymentIntent;
  }



}
