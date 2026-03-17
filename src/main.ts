import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete non match property with dto
      forbidNonWhitelisted: true, // raise an error if non match property with dto sended
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
