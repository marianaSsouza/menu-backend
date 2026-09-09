import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Spot } from '../spots/spot.entity';

export enum GuestCheckStatus {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
}


@Entity('guest-check')
export class GuestCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //como fazer uma notação de campo de data (IMPORTANTE)
  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  //status: string; é usado string para o status do guest check, como "open", "closed", etc.
  @Column({ 
    type: 'enum',
    enum: GuestCheckStatus,
    default: GuestCheckStatus.OPENED }) //default é o valor padrão
  status: GuestCheckStatus;

  @ManyToOne(() => Spot, { nullable: false }) //relacionamento com a entidade Spot, não pode ser nulo. Uma mesa pode ter vários guest checks, mas um guest check (comanda) pertence a uma mesa. A gente lê ao contrario, lê a mesa e vê as comandas dela, mas a comanda pertence a uma mesa.
  @JoinColumn({ name: 'spot_id' })
  spot: Spot;

}
