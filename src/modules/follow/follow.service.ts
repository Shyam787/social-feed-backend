import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { error } from 'console';

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

    async getfollwers(targetUserId: string){
        // check user exits
        const user = await this.prisma.user.findUnique({
            where: {
                id: targetUserId
            }
        });
        if (!user) {
            throw new NotFoundException('User not found')
        }

        // fetch followers
        const followers = await this.prisma.follow.findMany({
            where: {
                followingId: targetUserId
            },
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
            count: followers.length,
            followers: followers.map(follow => follow.follower)
        }

    }

}
