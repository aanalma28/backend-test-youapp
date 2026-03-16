import { Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  register(userData: RegisterDto) {
    return {
      message: 'User registered successfully',
    };
  }

  login(loginData: LoginDto) {
    return {
      message: 'User logged in successfully',
    };
  }
}
