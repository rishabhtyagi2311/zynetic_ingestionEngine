import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AnalyticsRepository } from './repositories/analytics.repository';

@Injectable()
export class AnalyticsService {

  constructor(
    private readonly repo: AnalyticsRepository,
  ) {}

  async getPerformance(vehicleId: string) {

    const meterId = await this.repo.getMeterId(vehicleId);

    if (!meterId) {
      throw new NotFoundException('Vehicle not mapped to meter');
    }

    const vehicleStats =
      await this.repo.getVehicleStats(vehicleId);

    const meterStats =
      await this.repo.getMeterStats(meterId);

    const totalDc = Number(vehicleStats.total_dc) || 0;
    const avgTemp = Number(vehicleStats.avg_temp) || 0;
    const totalAc = Number(meterStats.total_ac) || 0;

    const efficiency =
      totalAc > 0 ? totalDc / totalAc : 0;

    return {
      vehicleId,
      meterId,
      totalAc,
      totalDc,
      efficiency,
      avgBatteryTemp: avgTemp,
    };
  }
}
