import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { DatabaseModule } from '../database/database.module';
import { MeterRepository } from './repositories/meter.repository';
import { VehicleRepository } from './repositories/vehicle.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [IngestionController],
  providers: [IngestionService,
    MeterRepository,
    VehicleRepository,
  ]
})
export class IngestionModule {}
