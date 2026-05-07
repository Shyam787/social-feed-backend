import { Module } from '@nestjs/common';
import { FollowService } from './follow.service.js';
import { FollowController } from './follow.controller.js';
import { PrismaModule } from '../../database/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [FollowService],
  controllers: [FollowController]
})
export class FollowModule {}
