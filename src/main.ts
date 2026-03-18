import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete non match property with dto
      forbidNonWhitelisted: true, // raise an error if non match property with dto sended
      transform: true, // automatically convert from plain object into dto
    }),
  );
  // define rabbitmq
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')!],
      queue: configService.get<string>('RABBITMQ_QUEUE')!,
      queueOptions: { durable: true }, // setting for msg still available even rabbitmq restart
    },
  });

  await app.startAllMicroservices(); // run all microservices
  await app.listen(port);
}
void bootstrap();
