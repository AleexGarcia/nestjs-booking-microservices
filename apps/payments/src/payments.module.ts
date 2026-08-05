import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      TCP_PORT: Joi.number().required(),
      STRIPE_API_KEY: Joi.string().required(),
    })
  })],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule { }
