import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { PAYMENTS_SERVICE } from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) { }
  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentsClient.send('createCharge', createReservationDto.charge)
      .pipe(
        map((res) => {
          const reservation = this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId: userId,
          });
          return reservation;
        })
      )




  }

  findAll() {
    return this.reservationsRepository.find({})
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne({ _id: id })
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({ _id: id }, { $set: updateReservationDto })
  }

  remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: id });
  }
}
