/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Query, Get, UseGuards } from '@nestjs/common';
import { MessageServices } from './message.service';
import { Message } from './schemas/message.schema';
import { EventPattern } from '@nestjs/microservices';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@Controller('api')
export class MessageController {
  constructor(private readonly msgService: MessageServices) {}

  @Post('sendMessage')
  @UseGuards(JwtAuthGuard)
  async send(@Body() data: SendMessageDto) {
    return this.msgService.sendMessage(data.senderId, data.receiverId, data.message);
  }

  @Get('viewMessage')
  @UseGuards(JwtAuthGuard)
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
