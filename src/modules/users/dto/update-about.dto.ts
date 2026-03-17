import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsDate()
  @IsOptional()
  birthDate: Date;

  @IsString()
  @IsOptional()
  horoscopeSign: string;

  @IsString()
  @IsOptional()
  zodiacSign: string;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsNumber()
  @IsOptional()
  weight: number;
}
