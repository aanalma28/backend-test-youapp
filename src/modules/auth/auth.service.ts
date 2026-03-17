import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';

// eslint-disable-next-line prettier/prettier
import { UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async register(userData: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    if (userData.password !== userData.confirmPassword) {
      // eslint-disable-next-line prettier/prettier
      throw new BadRequestException('Password and confirm password do not match');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userModel.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });
    // payload JWT
    const payload: JwtPayload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      message: 'User registered successfully',
      token,
    };
  }

  async login(loginData: LoginDto) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const query = emailRegex.test(loginData.emailOrUsername)
      ? { email: loginData.emailOrUsername }
      : { username: loginData.emailOrUsername };
    const user = await this.userModel.findOne(query);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // eslint-disable-next-line prettier/prettier
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return {
      message: 'User logged in successfully',
    };
  }
}
