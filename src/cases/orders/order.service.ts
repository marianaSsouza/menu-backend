import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Order, OrderStatus } from "./entities/order-entity";
import { CreateOrderDto, CreateOrderItemDto } from "./dto/create-order";
import { OrderItem } from "./entities/order-item.entity";
import { GuestCheckService } from "../guest-checks/guest-check.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductService } from "../products/product.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status";

@Injectable()
export class OrderService {
  constructor(
    private readonly guestCheckService: GuestCheckService,
    private readonly productService: ProductService,
  ) {}

  @InjectRepository(Order)
  private readonly orderRepository: Repository<Order>

  @InjectRepository(OrderItem)
  private readonly orderItemRepository: Repository<OrderItem>


    private async  prepareItems(dto: CreateOrderItemDto): Promise<OrderItem>{
        const product = await this.productService.findOne(dto.productID);
        const subtotal = dto.quantity * Number(product.price);

        return this.orderItemRepository.create({
            product,
            quantity: dto.quantity,
            price: product.price,
            subtotal
        });
    }

  async create(dto: CreateOrderDto): Promise<Order> {
    // Regra #1: verificar se tem comanda aberta para a mesa
    const guestCheck = await this.guestCheckService.findOrCreateOpened(dto.spotID)

    //Monta o totalizador do pedido
    const items: OrderItem[] = [];
    let total = 0;

    //diferença de let para const: constante não é possível mudar o valor. Mesmo que ela tenha um vetor, muda os valores do vetor. O let fica dentro do escopo e pode ser modificado. 

    for (const itemDto of dto.items) {
        const item = await this.prepareItems(itemDto) //prepara para inserir no banco
        items.push(item);
        total += Number(item.subtotal)

    }

    // Monta o pedido
    const order = this.orderRepository.create({
        guestCheck,
        status: OrderStatus.NEW,
        total,
        items
    })

    //Gravar no banco o pedido
    return this.orderRepository.save(order)

  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'ASC'} 
    })
  }

   async findOne(id: string): Promise<Order> {
      const order = await this.orderRepository.findOneBy({ id });
  
      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }
  
      return order;

    }

    async updateStatus(
      id: string, 
      dto: UpdateOrderStatusDto) : Promise<Order> { //usado para mudar o status do pedido
        const order = await this.findOne(id)

        //determino a sequencia obrigatória de mudança de status
        const nextStatus: Record<OrderStatus, OrderStatus | undefined> = {
          [OrderStatus.NEW]:  OrderStatus.PREPARING, //esse new é que caso ele nao encontre o pedido, vai criar um novo
          [OrderStatus.PREPARING]: OrderStatus.READY,
          [OrderStatus.READY]: OrderStatus.DELIVERED,
          [OrderStatus.DELIVERED]: undefined
        
        }

        if (nextStatus[dto.status] !== dto.status) {
          throw new BadRequestException('Status inválido')
        }

        //forço a mudança de status
        order.status = dto.status

        //gravo a alteração no banco
        return this.orderRepository.save(order)
        
        
        // isso <> cria um atributo e o que estiver dentro significa o tipo 



    }

}