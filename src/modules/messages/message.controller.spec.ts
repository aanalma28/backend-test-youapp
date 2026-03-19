/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageServices } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { ExecutionContext } from '@nestjs/common';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageServices;

  // Mocking MessageServices
  const mockMessageService = {
    sendMessage: jest.fn(),
    viewMessage: jest.fn(),
    saveMsg: jest.fn(),
  };

  // Mocking JwtAuthGuard agar tidak perlu token asli saat testing
  const mockJwtGuard = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canActivate: jest.fn((_context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageServices,
          useValue: mockMessageService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageServices>(MessageServices);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('send (HTTP POST)', () => {
    it('should call service.sendMessage with correct data', async () => {
      const dto: SendMessageDto = {
        senderId: 'user-a',
        receiverId: 'user-b',
        message: 'Hello World',
      };

      mockMessageService.sendMessage.mockResolvedValue({
        message: 'Message queued successfully !',
      });

      const result = await controller.send(dto);

      expect(service.sendMessage).toHaveBeenCalledWith(dto.senderId, dto.receiverId, dto.message);
      expect(result.message).toBe('Message queued successfully !');
    });
  });

  describe('view (HTTP GET)', () => {
    it('should call service.viewMessage with query params', async () => {
      const userA = 'user-1';
      const userB = 'user-2';
      const mockChatHistory = [{ senderId: 'user-1', message: 'Hi' }];

      mockMessageService.viewMessage.mockResolvedValue(mockChatHistory);

      const result = await controller.view(userA, userB);

      expect(service.viewMessage).toHaveBeenCalledWith(userA, userB);
      expect(result).toEqual(mockChatHistory);
    });
  });

  describe('handleMsgSent (RabbitMQ Consumer)', () => {
    it('should call service.saveMsg when event pattern matches', async () => {
      const eventPayload = {
        senderId: 'user-a',
        receiverId: 'user-b',
        message: 'Internal event',
      };

      // Kita tidak butuh return value untuk event pattern biasanya
      mockMessageService.saveMsg.mockResolvedValue(eventPayload);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.handleMsgSent(eventPayload as any);

      expect(service.saveMsg).toHaveBeenCalledWith(eventPayload);
    });
  });
});
