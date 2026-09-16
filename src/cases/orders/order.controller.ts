import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order";
import { UpdateOrderStatusDto } from "./dto/update-order-status";
import { Order } from "./entities/order-entity";

@Controller('orders') //essa notação tem esteriotipo de controle e controla a entrada e saida da visão, controle de navegação. Controla também que ele será injetavel, não preciso instanciar. O modulo carrega sozinho para eu usar na minha aplicação. Isso é a inversão de controle. O que tá dentro dos parenteses é a rota.
export class OrderController { //esse export significa que agora está visivel, como se fosse um public

    constructor(
        private readonly service : OrderService  

    ){ }

    @Post()
    create(@Body() dto: CreateOrderDto): Promise<Order>{
        return this.service.create(dto);
    }

    @Get()
    findAll(): Promise<Order[]>{
        return this.service.findAll();

    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order>{ //esse parse é um validador 
        return this.service.findOne(id);

    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateOrderStatusDto
    ): Promise<Order>{
        return this.service.updateStatus(id, dto);
    }

}