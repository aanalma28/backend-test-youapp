import { Post, Get, Body, Controller } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getProfile')
  getProfile(@Body() userData: any) {
    return this.userService.getProfile(userData);
  }

  @Post('updateProfile')
  updateProfile(@Body() userData: any) {
    return this.userService.updateProfile(userData);
  }
}
