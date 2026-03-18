/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { MessageServices } from './message.service';
import { Message } from './schemas/message.schema';
import { EventPattern } from '@nestjs/microservices';

@Controller('api')
export class MessageController {
  constructor(private readonly msgService: MessageServices) {}

  @Post('sendMessage')
  async send(@Body() data: Message) {
    return this.msgService.sendMessage(data.senderId, data.receiverId, data.message);
  }

  @Get('viewMessage')
  async view(@Query('userA') userA: string, @Query('userB') userB: string) {
    return this.msgService.viewMessage(userA, userB);
  }

  // rabbitmq consumer -> listening message incomes
  @EventPattern('msg_sent')
  async handleMsgSent(data: Message) {
    console.log('RabbitMQ: Message Received !, Saving into DB...');
    await this.msgService.saveMsg(data);

    // code to notify user
    console.log(`NOTIFICATION: User ${data.receiverId} got a new message !`);
  }
}
