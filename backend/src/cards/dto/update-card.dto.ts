import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  chinese?: string;

  @IsString()
  @IsOptional()
  pinyin?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  vietnamese?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];
}

