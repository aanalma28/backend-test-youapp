/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { UpdateAboutDto } from './dto/update-about.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // 1. Mock Data untuk JWT Payload
  const mockJwtPayload = { sub: 'user-123', email: 'test@mail.com' };

  // 2. Mocking UserService
  const mockUserService = {
    getProfile: jest.fn().mockResolvedValue({ username: 'testuser', email: 'test@mail.com' }),
    updateProfile: jest.fn().mockResolvedValue({ message: 'Profile updated' }),
    updateAbout: jest.fn().mockResolvedValue({ message: 'About updated successfully' }),
    updateInterests: jest.fn().mockResolvedValue({ message: 'Interests updated' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      // 3. Override Guard agar tidak perlu validasi JWT sungguhan saat test
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should call userService.getProfile with correct id', async () => {
      const result = await controller.getProfile(mockJwtPayload);

      expect(service.getProfile).toHaveBeenCalledWith(mockJwtPayload.sub);
      expect(result).toEqual({ username: 'testuser', email: 'test@mail.com' });
    });
  });

  describe('updateProfile (Patch)', () => {
    it('should call userService.updateAbout and return success', async () => {
      const dto = { displayName: 'Aan Alma', gender: 'Male' } as UpdateAboutDto;

      const result = await controller.updateProfile(mockJwtPayload, dto);

      expect(service.updateAbout).toHaveBeenCalledWith(mockJwtPayload.sub, dto);
      expect(result.message).toBe('About updated successfully');
    });
  });

  describe('updateInterests', () => {
    it('should call userService.updateInterests', async () => {
      const dto = { interests: ['Coding', 'Gaming'] };

      const result = await controller.updateInterests(mockJwtPayload, dto);

      expect(service.updateInterests).toHaveBeenCalledWith(mockJwtPayload.sub, dto);
      expect(result.message).toBe('Interests updated');
    });
  });
});
