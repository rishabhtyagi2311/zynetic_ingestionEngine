import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DbTestService } from './db-test.service';

@Module({
  providers: [
    {
      provide: 'PG_POOL',

      useFactory: () => {
        return new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          max: 20, // max connections
        });
      },
      
    },
    DbTestService,
  ],

  exports: ['PG_POOL'],
})
export class DatabaseModule {}
