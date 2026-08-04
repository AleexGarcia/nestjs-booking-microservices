import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common/database';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './entities/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      })
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: ((configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          }
        }
        )),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule { }
