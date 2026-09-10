import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsPositive, IsUUID, ValidateNested } from "class-validator";

export class CreateOrderItemDto{
    @IsUUID()
    productID: string; // o cliente vai informar o id do produto que ele quer pedir.

    @IsInt()
    @IsPositive()
    quantity: number; // o cliente vai informar a quantidade do produto que ele quer pedir.

}


export class CreateOrderDto{

    @IsUUID()
    spotID: string; //quando o cliente vai criar um pedido, ele precisa informar qual é a mesa que ele está, para que o garçom possa saber de qual mesa é aquele pedido. Então, o cliente vai informar o id da mesa que ele está.

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]; //quando o cliente vai criar um pedido, ele precisa informar quais são os itens que ele quer pedir. Então, o cliente vai informar um array de itens, onde cada item é um objeto que contém o id do produto e a quantidade que ele quer pedir.
}