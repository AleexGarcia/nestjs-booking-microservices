import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({ transport: 
    Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.getOrThrow('TCP_PORT') 
    }
   })
  app.use(cookieParser.default());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('HTTP_PORT'));

}
bootstrap();
