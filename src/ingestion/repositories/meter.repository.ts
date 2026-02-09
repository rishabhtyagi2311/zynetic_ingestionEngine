import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

interface MeterHistoryInput {
  meterId: string;
  kwhConsumedAc: number;
  voltage: number;
  recordedAt: Date;
}

@Injectable()
export class MeterRepository {

  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
  ) {}

 
  async insertHistory(data: MeterHistoryInput) {
    const query = `
      INSERT INTO meter_history
      (meter_id, kwh_consumed_ac, voltage, recorded_at)
      VALUES ($1, $2, $3, $4)
    `;

    await this.pool.query(query, [
      data.meterId,
      data.kwhConsumedAc,
      data.voltage,
      data.recordedAt,
    ]);
  }

 
  async upsertLive(data: MeterHistoryInput) {
    const query = `
      INSERT INTO meter_live
      (meter_id, kwh_consumed_ac, voltage, last_seen)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (meter_id)
      DO UPDATE SET
        kwh_consumed_ac = EXCLUDED.kwh_consumed_ac,
        voltage = EXCLUDED.voltage,
        last_seen = EXCLUDED.last_seen
    `;

    await this.pool.query(query, [
      data.meterId,
      data.kwhConsumedAc,
      data.voltage,
      data.recordedAt,
    ]);
  }
}
