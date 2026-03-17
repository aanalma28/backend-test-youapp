import { Post, Body, Controller } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }
  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
}
