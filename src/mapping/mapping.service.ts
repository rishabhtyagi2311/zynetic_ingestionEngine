import { Injectable } from '@nestjs/common';
import { MappingRepository } from './repository/mapping.repository';

@Injectable()
export class MappingService {

  constructor(
    private readonly repo: MappingRepository,
  ) {}

  async createMapping(
    vehicleId: string,
    meterId: string,
  ) {

    await this.repo.upsertMapping(
      vehicleId,
      meterId,
    );

    return {
      vehicleId,
      meterId,
      status: 'mapped',
    };
  }
}
