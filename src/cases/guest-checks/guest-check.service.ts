import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  GuestCheck,
  GuestCheckStatus,
} from './guest-check.entity';

import { CreateGuestCheckDto } from './dto/create-guest-check';

import { Spot } from '../spots/spot.entity';

@Injectable()
export class GuestCheckService {
  constructor(
    @InjectRepository(GuestCheck)
    private readonly guestCheckRepository: Repository<GuestCheck>,

    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,
  ) {}

  async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {
    // Regra 1: Não se abre comanda em mesa inexistente ou inativa.
    const spot = await this.spotRepository.findOneBy({
      id: dto.spotId,
      active: true,
    });

    if (!spot) {
      throw new NotFoundException(
        'Não foi encontrada uma mesa ativa com este id',
      );
    }

    // Regra 2: Não se abre uma nova comanda
    // se já existir uma comanda aberta para a mesa.
    const opened = await this.guestCheckRepository.exists({
      where: {
        spot: { id: dto.spotId },
        status: GuestCheckStatus.OPENED,
      },
    });

    if (opened) {
      throw new ConflictException(
        'Já existe uma comanda aberta para esta mesa',
      );
    }

    // Se chegou aqui, todas as regras foram atendidas.
    const guestCheck = this.guestCheckRepository.create({
      spot,
      status: GuestCheckStatus.OPENED,
    });

    return this.guestCheckRepository.save(guestCheck);
  }

  async findOne(id: string): Promise<GuestCheck> {
    const guestCheck = await this.guestCheckRepository.findOneBy({ id });

    if (!guestCheck) {
      throw new NotFoundException('Comanda não encontrada');
    }

    return guestCheck;
  }

  async close(id: string): Promise<GuestCheck> {
    const guestCheck = await this.findOne(id);

    // Regra 1: Só é possível fechar uma comanda aberta.
    if (guestCheck.status === GuestCheckStatus.CLOSED) {
      throw new BadRequestException('A comanda já está fechada');
    }

    // Regra 2: Não posso fechar uma comanda
    // com pedidos que ainda não foram entregues.
    // TODO: Implementar essa validação posteriormente.

    // Se chegou aqui, a comanda pode ser fechada.
    guestCheck.status = GuestCheckStatus.CLOSED;

    return this.guestCheckRepository.save(guestCheck);
  }


  findOpenedBySpotId(spotId: string): Promise<GuestCheck | null> {
    return this.guestCheckRepository.findOne({
      where: {
        spot: { id: spotId },
        status: GuestCheckStatus.OPENED,
      },

      relations: {spot: true}

    })
  }

  async findOrCreateOpened(spotId: string): Promise<GuestCheck> {
   
    const opened = await this.findOrCreateOpened(spotId);

    //fluxo do SIM
    if (opened) {
      return opened;
    }

    return this.create({spotId})

  }

}