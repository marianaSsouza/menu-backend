import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

export class CreateGuestCheckDto {
  @IsUUID()
  @IsNotEmpty()
  @MaxLength(60)
  spotId: string; //só vamos usar o id da mesa, não vamos criar a mesa aqui, só vamos criar a comanda e associar a uma mesa existente
}
