import { Module } from '@nestjs/common';
import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DatabaseModule } from './database/database.module';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [IngestionModule, AnalyticsModule, DatabaseModule, MappingModule],
})
export class AppModule {}
