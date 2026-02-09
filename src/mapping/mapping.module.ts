import { Module } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { MappingController } from './mapping.controller';
import { MappingRepository } from './repository/mapping.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MappingController],
  providers: [
    MappingService,
    MappingRepository,
  ],
})
export class MappingModule {}