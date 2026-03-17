import { IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateInterestDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests: string[];
}
