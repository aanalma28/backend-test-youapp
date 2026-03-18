import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/message.schema';
import { Message } from './schemas/message.schema';
import { MessageServices } from './message.service';
import { MessageController } from './message.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Message.name, schema: ChatSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'MSG_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL')!],
            queue: config.get<string>('RABBITMQ_QUEUE')!,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageServices],
})
export class MessageModule {}
