import { GuestCheck } from "src/cases/guest-checks/guest-check.entity";
import { OrderItem } from "./order-item.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum OrderStatus {
    NEW = 'NEW',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERED = 'DELIVERED',
  }

@Entity()
export class Order{

    @PrimaryGeneratedColumn('uuid')
    id: string; //isso é um atributo da classe Order, que representa o identificador único do pedido.

    @CreateDateColumn({ name: 'created_at'})    
    createdAt: Date; //isso é um atributo da classe Order, que representa a data e hora em que o pedido foi criado.

    @ManyToOne(() => GuestCheck, { nullable: false }) //necessário informar pois cada pedido tem uma conta de convidado, se não tem a identificação de qual conta de convidado é, eu não vou saber de qual conta de convidado é aquele pedido. 

    @JoinColumn({ name: 'guest_check_id' })//esse é o nome da coluna que vai ser criada no banco de dados.
    guestCheck: GuestCheck; //isso é um atributo da classe Order, que representa a conta do convidado associada ao pedido.

    //a classe é a linha, nao é a coluna. Quando faço a referencia em um diagrama de classe, faço referencia a instancia que está alocada em memoria. Diagrama de classe vc faz referencia a classe, não ao campo. O aributo que representa a coluna, é geralmente o mesmo nome da classe, mas com letra minuscula.

    //  A classe é a linha, o atributo é a coluna. A classe é a instancia que está alocada em memoria, o atributo é a coluna que representa a classe.

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    total: number; //isso é um atributo da classe Order, que representa o valor total do pedido.

    @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.NEW}) //isso é um atributo da classe Order, que representa o status do pedido. O status do pedido é um enum, que pode ser NEW, PREPARING, READY ou DELIVERED. O valor padrão é NEW.
    status: OrderStatus;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true
    }) 

    items: OrderItem[]; //isso é um atributo da classe Order, que representa os itens do pedido. A classe OrderItem representa cada item do pedido, incluindo informações como o produto, a quantidade e o preço.
   
}