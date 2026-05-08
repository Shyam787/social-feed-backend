import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

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

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    unfollowUser(
        @CurrentUser('userId') currentUserId,
        @Param('userId') targetUserId: string
    ) {
        return this.followService.unfollowUser(currentUserId.userId, targetUserId)
    }

    @Get('followers/:userId')
    @UseGuards(JwtAuthGuard)
    getFollowers(
        @Param('userId') UserId: string,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return this.followService.getFollwers(UserId, paginationQuery)
    }

    @Get('following/:userId')
    @UseGuards(JwtAuthGuard)
    getFollowing(
        @Param('userId') UserId: string,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return this.followService.getFollwing(UserId, paginationQuery)
    }

    @Get('stats/:userId')
    @UseGuards(JwtAuthGuard)
    getFollowStats(
        @Param('userId') UserId: string
    ) {
        return this.followService.getFollowStats(UserId)
    }

}

