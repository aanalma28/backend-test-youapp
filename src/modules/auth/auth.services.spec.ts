/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let model: any;
  let jwtService: JwtService;

  // 1. Buat Mock untuk Mongoose Model
  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  // 2. Buat Mock untuk JwtService
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@mail.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should throw ConflictException if email exists', async () => {
      model.findOne.mockResolvedValue({ email: 'test@mail.com' }); // Simulasi user ketemu

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      model.findOne.mockResolvedValue(null); // Email aman
      const badDto = { ...registerDto, confirmPassword: 'wrong' };

      await expect(service.register(badDto)).rejects.toThrow(BadRequestException);
    });

    it('should register a user successfully', async () => {
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue({
        username: 'testuser',
        email: 'test@mail.com',
      });

      const result = await service.register(registerDto);

      expect(result.message).toBe('User registered successfully');
      expect(model.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      emailOrUsername: 'test@mail.com',
      password: 'password123',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      model.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should login successfully and return a token', async () => {
      const mockUser = {
        _id: 'mock_id',
        email: 'test@mail.com',
        password: await bcrypt.hash('password123', 10),
      };

      model.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('token');
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
