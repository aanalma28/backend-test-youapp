/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let model: any;

  // Helper untuk mock chaining Mongoose
  const mockMongooseQuery = {
    exec: jest.fn(),
    select: jest.fn().mockReturnThis(),
  };

  const mockUserModel = {
    findById: jest.fn().mockReturnValue(mockMongooseQuery),
    findByIdAndUpdate: jest.fn().mockReturnValue(mockMongooseQuery),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile if found', async () => {
      const mockResult = { username: 'aan', email: 'aan@mail.com' };
      mockMongooseQuery.exec.mockResolvedValue(mockResult);

      const result = await service.getProfile('user-123');

      expect(model.findById).toHaveBeenCalledWith('user-123');
      expect(result.data.username).toBe('aan');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockMongooseQuery.exec.mockResolvedValue(null);

      await expect(service.getProfile('wrong-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAbout (Clean Data Logic)', () => {
    it('should filter out null or empty string values', async () => {
      const dto = { displayName: 'Aan', gender: '', weight: null }; // gender & weight harusnya hilang
      const mockUpdatedUser = { displayName: 'Aan' };

      mockMongooseQuery.exec.mockResolvedValue(mockUpdatedUser);

      await service.updateAbout('user-123', dto as any);

      // Pastikan $set hanya berisi displayName
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-123',
        { $set: { displayName: 'Aan' } },
        { returnDocument: 'after' },
      );
    });
  });

  describe('updateProfile (Password Hashing)', () => {
    it('should hash password if provided', async () => {
      const dto = { password: 'newpassword123' };
      const mockUpdatedUser = { username: 'aan', email: 'aan@mail.com' };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
      mockMongooseQuery.exec.mockResolvedValue(mockUpdatedUser);

      await service.updateProfile('user-123', dto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-123',
        { $set: { password: 'hashed_pass' } },
        { returnDocument: 'after' },
      );
    });
  });
});
