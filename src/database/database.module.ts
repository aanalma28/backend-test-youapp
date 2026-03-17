import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/youapp')],
})
export class DatabaseModule {}
