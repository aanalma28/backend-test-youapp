import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAboutDto } from './dto/update-about.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getProfile(id: string) {
    const profile = await this.userModel.findById(id).exec();

    if (!profile) {
      throw new NotFoundException('User not found !');
    }

    return {
      message: 'User found !',
      data: {
        username: profile.username,
        email: profile.email,
        displayName: profile.displayName,
        gender: profile.gender,
        birthdate: profile.birthDate,
        horoscopeSign: profile.horoscopeSign,
        zodiacSign: profile.zodiacSign,
        height: profile.height,
        weight: profile.weight,
        interests: profile.interests,
        profilePicture: profile.profilePicture,
      },
    };
  }

  async updateProfile(id: string, data: UpdateUserProfileDto) {
    const toUpdate: UpdateUserProfileDto = {};
    if (data?.username) toUpdate.username = data.username;
    if (data?.email) toUpdate.email = data.email;
    if (data?.password) {
      const salt = await bcrypt.hash(data.password, 10);
      toUpdate.password = salt;
    }
    const updateProfile = await this.userModel
      .findByIdAndUpdate(id, { $set: toUpdate }, { returnDocument: 'after' })
      .exec();

    if (!updateProfile) {
      throw new NotFoundException('User not found !');
    }

    return {
      message: 'Update Profile Successfully !',
      data: {
        username: updateProfile.username,
        email: updateProfile.email,
      },
    };
  }

  async updateAbout(id: string, data: UpdateAboutDto) {
    const cleanData = Object.fromEntries(
      // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
      Object.entries(data || {}).filter(([_, value]) => value != null && value !== ''),
    );

    const updateAbout = await this.userModel
      .findByIdAndUpdate(id, { $set: cleanData }, { returnDocument: 'after' })
      .select('-_id -password -__v')
      .exec();

    if (!updateAbout) throw new NotFoundException('User not found !');

    return {
      message: 'Update About Successfully !',
      data: {
        updateAbout,
      },
    };
  }

  async updateInterests(id: string, data: UpdateInterestDto) {
    const updateAbout = await this.userModel
      .findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after' })
      .select('interests -_id')
      .exec();

    if (!updateAbout) throw new NotFoundException('User not found !');

    return {
      message: 'Update Interests Successfully !',
      data: {
        updateAbout,
      },
    };
  }
}
