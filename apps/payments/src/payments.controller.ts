import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices/';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('createCharge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() createPaymentDto: CreatePaymentDto,
  ): Promise<Stripe.PaymentIntent> {
    return this.paymentsService.createCharge(createPaymentDto);
  }
}
