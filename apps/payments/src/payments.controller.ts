import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices/';
import  Stripe from 'stripe';
import { CreateChargeDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('createCharge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() createChargeDto: CreateChargeDto): Promise<Stripe.PaymentIntent> {
    return this.paymentsService.createCharge(createChargeDto);
  }

}
