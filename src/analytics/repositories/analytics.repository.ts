import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AnalyticsRepository {

  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
  ) {}

  async getMeterId(vehicleId: string): Promise<string | null> {

    const res = await this.pool.query(
      `
      SELECT meter_id
      FROM vehicle_meter_map
      WHERE vehicle_id = $1
      `,
      [vehicleId],
    );

    return res.rows[0]?.meter_id ?? null;
  }

 
  async getVehicleStats(vehicleId: string) {

    const res = await this.pool.query(
      `
      SELECT
        SUM(kwh_delivered_dc) AS total_dc,
        AVG(battery_temp) AS avg_temp
      FROM vehicle_history
      WHERE vehicle_id = $1
        AND recorded_at >= NOW() - INTERVAL '24 hours'
      `,
      [vehicleId],
    );

    return res.rows[0];
  }


  async getMeterStats(meterId: string) {

    const res = await this.pool.query(
      `
      SELECT
        SUM(kwh_consumed_ac) AS total_ac
      FROM meter_history
      WHERE meter_id = $1
        AND recorded_at >= NOW() - INTERVAL '24 hours'
      `,
      [meterId],
    );

    return res.rows[0];
  }
}
