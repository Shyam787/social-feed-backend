import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js'; 
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

@Injectable()
export class FollowService {
    constructor(private prisma: PrismaService) {}

    async followUser(currentUserId: string, targetUserId: string){

        // prevent self follow
        if (currentUserId === targetUserId) {
            throw new BadRequestException('You cannot follow yourself')
        };
        console.log('current user: ', currentUserId)
        console.log('target user: ', targetUserId)
        // check target user exists
        const targetUser = await this.prisma.user.findUnique({
            where: {
                id: targetUserId
            }
        });

        if (!targetUser) {
            throw new NotFoundException('User not found');
        };

        // check duplication follow
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingFollow) {
            throw new BadRequestException('Already following this user');
        };

        // create follow flow
        const follow = await this.prisma.follow.create({

            data: {
                followerId: currentUserId,
                followingId: targetUserId
            }
        });

        return {
            message: 'User followed successfully',
            follow,
        };

    }

    async unfollowUser(currentUserId: string, targetUserId: string){
        // prevent self follow
        if (currentUserId === targetUserId) {
            throw new BadRequestException('You cannot unfollow yourself')
        };

        // check relationship exists
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });
        if (!existingFollow) {
            throw new NotFoundException('You are not following this user');
        };

        // delete relationship(unfollow)
        await this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        return {message: 'User unfollowed successfully'}

    }

    async getFollwers(
        UserId: string, 
        paginationQuery: PaginationQueryDto
    ){
        // check user exits
        const user = await this.prisma.user.findUnique({
            where: {
                id: UserId
            }
        });
        if (!user) {
            throw new NotFoundException('User not found')
        };

        // pagination query
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;

        // total followers count
        const totalFollowers = await this.prisma.follow.count({
            where: {
                followingId: UserId
            }
        });

        // paginated followers
        const followers = await this.prisma.follow.findMany({
            where: {
                followingId: UserId
            },
            skip,
            take: limit,
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true
                    }
                }
            }
        });


        return {
            count: totalFollowers,
            page,
            limit,
            hasNextPage: (skip + followers.length) < totalFollowers,
            followers: followers.map(follow => follow.follower)
        }

    }

    async getFollwing(
        UserId: string,
        paginationQuery: PaginationQueryDto
    ){
        // check user exits
        const user = await this.prisma.user.findUnique({
            where: {
                id: UserId
            }
        });
        if (!user) {
            throw new NotFoundException('User not found')
        };

        // pagination query
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;

        // total following count
        const totalFollowing = await this.prisma.follow.count({
            where: {
                followerId: UserId
            }
        });

        // paginated following
        const following = await this.prisma.follow.findMany({
            where: {
                followerId: UserId
            },
            skip,
            take: limit,
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true
                    }
                }
            }
        });


        return {
            count: totalFollowing,
            page,
            limit,
            hasNextPage: (skip + following.length) < totalFollowing,
            following: following.map(follow => follow.following)
        }

    }

    async getFollowStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const followersCount =
            await this.prisma.follow.count({
            where: {
                followingId: userId,
            },
        });

        const followingCount =
            await this.prisma.follow.count({
            where: {
                followerId: userId,
            },
        });

        return {
            followersCount,
            followingCount,
        };
    }

}
