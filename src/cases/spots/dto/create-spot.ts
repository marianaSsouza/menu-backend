import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSpotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;
}
