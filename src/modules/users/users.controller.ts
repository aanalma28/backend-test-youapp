/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import * as jwtPayloadInterface from '../auth/types/jwt-payload.interface';
import { UserService } from './users.service';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateAboutDto } from './dto/update-about.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';

// The endpoints with protected JWT will be flowed like this:
// Frontend (with jwt) -> backend endpoint
// backend endpoint -> decorator GetUser to decode JWT and get data inside JWT
// return GetUser -> services parameter (with frontend request body if they send)

@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  // Get User Profile
  @Get('getProfile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: jwtPayloadInterface.JwtPayload) {
    return this.userService.getProfile(user.sub);
  }

  // Updating profile for crucial data like email, username, or password
  // The endpoint should be updateProfile
  @Post('createProfile')
  @UseGuards(JwtAuthGuard)
  createProfile(
    @GetUser() user: jwtPayloadInterface.JwtPayload,
    @Body() userData: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfile(user.sub, userData);
  }

  // Updating about user like display name, image, birthdate, etc.
  // The endpoint should be updateAbout
  @Patch('updateProfile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@GetUser() user: jwtPayloadInterface.JwtPayload, @Body() userData: UpdateAboutDto) {
    return this.userService.updateAbout(user.sub, userData);
  }

  // Updating interest
  @Patch('updateInterest')
  @UseGuards(JwtAuthGuard)
  updateInterests(
    @GetUser() user: jwtPayloadInterface.JwtPayload,
    @Body() userData: UpdateInterestDto,
  ) {
    return this.userService.updateInterests(user.sub, userData);
  }
}
