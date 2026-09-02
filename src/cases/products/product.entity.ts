import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column ({ type: 'text', nullable: true })
  description?: string; //isso significa que a descrição é opcional, ou seja, pode ser nula ou não.

  @Column({ type: 'number', precision: 10, scale: 2 })
  price: number;
  
  @Column({ type: 'text', nullable: true })
  picture?: string;

  @ManyToOne(()=> Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null; //isso significa que a categoria é opcional, ou seja, pode ser nula ou não.

}
