import { Injectable, OnModuleInit} from '@nestjs/common';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '../../../generated/prisma/client.js';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}