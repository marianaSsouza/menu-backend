import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateCategoryDto {

  @IsOptional
  IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
