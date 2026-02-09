import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

interface VehicleHistoryInput {
  vehicleId: string;
  soc: number;
  kwhDeliveredDc: number;
  batteryTemp: number;
  recordedAt: Date;
}

@Injectable()
export class VehicleRepository {

  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
  ) {}

  async insertHistory(data: VehicleHistoryInput) {
    const query = `
      INSERT INTO vehicle_history
      (vehicle_id, soc, kwh_delivered_dc, battery_temp, recorded_at)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await this.pool.query(query, [
      data.vehicleId,
      data.soc,
      data.kwhDeliveredDc,
      data.batteryTemp,
      data.recordedAt,
    ]);
  }

  async upsertLive(data: VehicleHistoryInput) {
    const query = `
      INSERT INTO vehicle_live
      (vehicle_id, soc, kwh_delivered_dc, battery_temp, last_seen)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (vehicle_id)
      DO UPDATE SET
        soc = EXCLUDED.soc,
        kwh_delivered_dc = EXCLUDED.kwh_delivered_dc,
        battery_temp = EXCLUDED.battery_temp,
        last_seen = EXCLUDED.last_seen
    `;

    await this.pool.query(query, [
      data.vehicleId,
      data.soc,
      data.kwhDeliveredDc,
      data.batteryTemp,
      data.recordedAt,
    ]);
  }
}
