import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAboutDto } from './dto/update-about.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getProfile(userData: any) {}
}
