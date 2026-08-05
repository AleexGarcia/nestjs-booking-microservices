import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  const tcpPort = configService.getOrThrow<number>('TCP_PORT');

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();

}
bootstrap();
