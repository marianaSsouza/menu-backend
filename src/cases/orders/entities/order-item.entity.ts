import { Product } from "src/cases/products/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order-entity";



@Entity('order_item')

export class OrderItem{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, { nullable: false }) //necessário informar pois cada pedido tem um item, se não tem a identificação de qual pedido é, eu não vou saber de qual pedido é aquele item. Então, a relação é de muitos para um, pois um pedido pode ter muitos itens, mas um item pertence a apenas um pedido.

    @JoinColumn({ name: 'order_id' })
    order: Order;

    //diagrama de clase voce le em quem está sendo implementado.
    @ManyToOne(() => Product, { nullable: false }) //necessário informar pois cada item tem um produto, se não tem a identificação de qual produto é, eu não vou saber de qual produto é aquele item. Então, a relação é de muitos para um, pois um produto pode ter muitos itens, mas um item pertence a apenas um produto. O onDelete: 'CASCADE' significa que quando o produto for deletado, todos os itens relacionados a ele também serão deletados.
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'integer'}) //tudo o que coloca dentro de decorator, é para que o banco de dados entenda. 
    quantity: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    subtotal: number;   



    


}