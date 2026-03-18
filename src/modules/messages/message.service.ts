import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageServices {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
    @Inject('MSG_SERVICE') private readonly client: ClientProxy,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async sendMessage(senderId: string, receiverId: string, message: string) {
    const payload = { senderId, receiverId, message, createdAt: new Date() };
    this.client.emit('msg_sent', payload);
    return { message: 'Message queued successfully !' };
  }

  async viewMessage(userA: string, userB: string) {
    const messages = await this.msgModel
      .find({
        $or: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      })
      .sort({ createdAt: 1 })
      .select('-_id -__v')
      .exec();
    return {
      message: 'Specific messages retrivied !',
      data: { messages },
    };
  }

  async saveMsg(data: SendMessageDto) {
    return await this.msgModel.create(data);
  }
}
