import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('follow')
export class FollowController {
    constructor(private followService: FollowService){}

    @Post(':userId')
    @UseGuards(JwtAuthGuard)
    followUser(
        @CurrentUser('userId') currentUserId,
        @Param('userId') targetUserId: string
    ) {
        return this.followService.followUser(currentUserId.userId, targetUserId)
    }

}

