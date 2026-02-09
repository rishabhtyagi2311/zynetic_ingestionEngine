import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbTestService implements OnModuleInit {

  constructor(
    @Inject('PG_POOL') private pool: Pool,
  ) {}

  async onModuleInit() {

    const res = await this.pool.query('SELECT NOW()');

    console.log('DB Connected:', res.rows[0]);
  }
}
