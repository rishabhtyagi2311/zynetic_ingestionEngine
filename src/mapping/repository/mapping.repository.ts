import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MappingRepository {

  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
  ) {}

  async upsertMapping(
    vehicleId: string,
    meterId: string,
  ) {

    const query = `
      INSERT INTO vehicle_meter_map
      (vehicle_id, meter_id)
      VALUES ($1, $2)

      ON CONFLICT (vehicle_id)
      DO UPDATE SET
        meter_id = EXCLUDED.meter_id
    `;

    await this.pool.query(query, [
      vehicleId,
      meterId,
    ]);
  }

  async findByVehicleId(vehicleId: string) {

    const res = await this.pool.query(
      `
      SELECT meter_id
      FROM vehicle_meter_map
      WHERE vehicle_id = $1
      `,
      [vehicleId],
    );

    return res.rows[0];
  }
}
