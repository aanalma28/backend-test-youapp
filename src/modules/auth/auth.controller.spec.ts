import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // 1. Mock data untuk keperluan testing
  const mockUser = { email: 'test@mail.com', username: 'testuser' };
  const mockToken = { access_token: 'mock_jwt_token' };

  // 2. Mocking AuthService
  const mockAuthService = {
    // eslint-disable-next-line prettier/prettier
    register: jest.fn().mockResolvedValue({ message: 'User registered', data: mockUser }),
    login: jest.fn().mockResolvedValue(mockToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Menggunakan mock bukan service asli
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the result', async () => {
      const dto: RegisterDto = {
        email: 'test@mail.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: '',
      };

      const result = await controller.register(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'User registered', data: mockUser });
    });
  });

  describe('login', () => {
    it('should call authService.login and return a token', async () => {
      const dto: LoginDto = {
        emailOrUsername: 'test@mail.com',
        password: 'password123',
      };

      const result = await controller.login(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockToken);
    });
  });
});
