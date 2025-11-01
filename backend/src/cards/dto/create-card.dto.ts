import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  chinese: string;

  @IsString()
  @IsOptional()
  pinyin?: string;

  @IsString()
  @IsNotEmpty()
  vietnamese: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];
}

