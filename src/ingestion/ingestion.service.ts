import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { MeterDto } from './dto/meter.dto';
import { VehicleDto } from './dto/vehicle.dto';

import { MeterRepository } from './repositories/meter.repository';
import { VehicleRepository } from './repositories/vehicle.repository';

@Injectable()
export class IngestionService {

  constructor(
    private readonly meterRepo: MeterRepository,
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async process(payload: any) {

    // 🔍 Detect Type
    if (payload.meterId) {
      return this.handleMeter(payload);
    }

    if (payload.vehicleId) {
      return this.handleVehicle(payload);
    }

    throw new BadRequestException('Unknown telemetry type');
  }


  private async handleMeter(payload: any) {

    const dto = plainToInstance(MeterDto, payload);

    await validateOrReject(dto);

    const recordedAt = new Date(dto.timestamp * 1000);

    await this.meterRepo.insertHistory({
      meterId: dto.meterId,
      kwhConsumedAc: dto.kwhConsumedAc,
      voltage: dto.voltage,
      recordedAt,
    });

    await this.meterRepo.upsertLive({
      meterId: dto.meterId,
      kwhConsumedAc: dto.kwhConsumedAc,
      voltage: dto.voltage,
      recordedAt,
    });

    return {
      status: 'meter_ingested',
    };
  }


  private async handleVehicle(payload: any) {

    const dto = plainToInstance(VehicleDto, payload);

    await validateOrReject(dto);

    const recordedAt = new Date(dto.timestamp * 1000);

    await this.vehicleRepo.insertHistory({
      vehicleId: dto.vehicleId,
      soc: dto.soc,
      kwhDeliveredDc: dto.kwhDeliveredDc,
      batteryTemp: dto.batteryTemp,
      recordedAt,
    });

    await this.vehicleRepo.upsertLive({
      vehicleId: dto.vehicleId,
      soc: dto.soc,
      kwhDeliveredDc: dto.kwhDeliveredDc,
      batteryTemp: dto.batteryTemp,
      recordedAt,
    });

    return {
      status: 'vehicle_ingested',
    };
  }
}
