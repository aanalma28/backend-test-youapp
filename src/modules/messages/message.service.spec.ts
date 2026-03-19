/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessageServices } from './message.service';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';

describe('MessageServices', () => {
  let service: MessageServices;
  let model: Model<Message>;
  let clientProxy: any;

  // Mocking Mongoose Model
  const mockMessageModel = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  // Mocking RabbitMQ ClientProxy
  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageServices,
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
        {
          provide: 'MSG_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<MessageServices>(MessageServices);
    model = module.get<Model<Message>>(getModelToken(Message.name));
    clientProxy = module.get('MSG_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should emit msg_sent event to RabbitMQ', async () => {
      const senderId = 'user1';
      const receiverId = 'user2';
      const message = 'Halo!';

      const result = await service.sendMessage(senderId, receiverId, message);

      expect(clientProxy.emit).toHaveBeenCalledWith(
        'msg_sent',
        expect.objectContaining({
          senderId,
          receiverId,
          message,
          createdAt: expect.any(Date),
        }),
      );
      expect(result.message).toBe('Message queued successfully !');
    });
  });

  describe('viewMessage', () => {
    it('should return messages between two users', async () => {
      const userA = 'user1';
      const userB = 'user2';
      const mockData = [{ senderId: 'user1', message: 'Test' }];

      mockMessageModel.exec.mockResolvedValue(mockData);

      const result = await service.viewMessage(userA, userB);

      expect(mockMessageModel.find).toHaveBeenCalledWith({
        $or: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      });
      expect(result.data.messages).toEqual(mockData);
      expect(result.message).toBe('Specific messages retrivied !');
    });
  });

  describe('saveMsg', () => {
    it('should create a new message record in DB', async () => {
      const dto = {
        senderId: 'user1',
        receiverId: 'user2',
        message: 'Saved message',
      };

      mockMessageModel.create.mockResolvedValue(dto);

      const result = await service.saveMsg(dto as any);

      expect(mockMessageModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });
});
