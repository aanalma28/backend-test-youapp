import { Post, Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() userData: any) {
    return this.authService.register(userData);
  }
  @Post('login')
  login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }
}
