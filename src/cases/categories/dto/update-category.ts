import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class UpdateCategoryDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsUrl()
  icon?: string;
}
